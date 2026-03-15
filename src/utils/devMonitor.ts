/**
 * Автоматический Dev Monitor
 * Перехватывает ВСЁ: ошибки, запросы, клики, изменения состояния
 * Не требует изменений в компонентах - работает автоматически
 *
 * Для включения вызовите в консоли браузера:
 * import('@/utils/devMonitor').then(m => m.default.init())
 */

interface NavigationTimingEntry extends PerformanceEntry {
  domContentLoadedEventEnd: number;
  domContentLoadedEventStart: number;
  loadEventEnd: number;
  loadEventStart: number;
  fetchStart: number;
  domainLookupEnd: number;
  domainLookupStart: number;
  connectEnd: number;
  connectStart: number;
  responseStart: number;
  requestStart: number;
  responseEnd: number;
  domComplete: number;
  domLoading: number;
}

interface ExtendedXHR extends XMLHttpRequest {
  _method?: string;
  _url?: string | URL;
  _startTime?: number;
}

const isDev = process.env.NODE_ENV === 'development';

class DevMonitor {
  private initialized = false;

  init() {
    if (!isDev || this.initialized || typeof window === 'undefined') return;

    this.initialized = true;

    console.log('%c[Dev Monitor] Активирован', 'color: #00ff00; font-size: 14px; font-weight: bold');

    this.interceptConsole();
    this.interceptErrors();
    this.interceptFetch();
    this.interceptXHR();
    this.interceptClicks();
    this.interceptRouteChanges();
    this.interceptLocalStorage();
    this.interceptPromises();
    this.monitorPerformance();
  }

  private interceptConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    console.log = (...args: unknown[]) => {
      originalLog('%c[LOG]', 'color: #2196F3; font-weight: bold', ...args);
    };

    console.warn = (...args: unknown[]) => {
      originalWarn('%c[WARN]', 'color: #FF9800; font-weight: bold', ...args);
    };

    console.error = (...args: unknown[]) => {
      originalError('%c[ERROR]', 'color: #F44336; font-weight: bold', ...args);
    };

    console.info = (...args: unknown[]) => {
      originalInfo('%c[INFO]', 'color: #4CAF50; font-weight: bold', ...args);
    };

    console.debug = (...args: unknown[]) => {
      originalDebug('%c[DEBUG]', 'color: #9C27B0; font-weight: bold', ...args);
    };
  }

  private interceptErrors() {
    window.addEventListener('error', (event) => {
      console.group('%c[JavaScript Error]', 'color: #F44336; font-size: 12px; font-weight: bold');
      console.error('Message:', event.message);
      console.error('File:', event.filename);
      console.error('Line:', event.lineno, 'Column:', event.colno);
      console.error('Error Object:', event.error);
      console.error('Stack:', event.error?.stack);
      console.groupEnd();
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.group('%c[Unhandled Promise Rejection]', 'color: #F44336; font-size: 12px; font-weight: bold');
      console.error('Reason:', event.reason);
      console.error('Promise:', event.promise);
      if (event.reason?.stack) {
        console.error('Stack:', event.reason.stack);
      }
      console.groupEnd();
    });

    window.addEventListener('react-error', ((event: CustomEvent) => {
      console.group('%c[React Error]', 'color: #F44336; font-size: 12px; font-weight: bold');
      console.error('Component:', event.detail?.componentStack);
      console.error('Error:', event.detail?.error);
      console.groupEnd();
    }) as EventListener);
  }

  private interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [url, options] = args;
      const startTime = performance.now();

      console.group(`%c[FETCH ${options?.method || 'GET'}]`, 'color: #03A9F4; font-weight: bold');
      console.log('URL:', url);
      console.log('Options:', options);

      try {
        const response = await originalFetch(...args);
        const duration = (performance.now() - startTime).toFixed(2);

        const clonedResponse = response.clone();
        let responseData;

        try {
          responseData = await clonedResponse.json();
        } catch {
          responseData = await clonedResponse.text();
        }

        console.log(`%c[Response] [${response.status}] ${duration}ms`,
          response.ok ? 'color: #4CAF50' : 'color: #F44336');
        console.log('Data:', responseData);
        console.groupEnd();

        return response;
      } catch (error) {
        const duration = (performance.now() - startTime).toFixed(2);
        console.log(`%c[Error] ${duration}ms`, 'color: #F44336; font-weight: bold');
        console.error(error);
        console.groupEnd();
        throw error;
      }
    };
  }

  private interceptXHR() {
    const originalXHR = window.XMLHttpRequest;
    const xhrOpen = originalXHR.prototype.open;
    const xhrSend = originalXHR.prototype.send;

    originalXHR.prototype.open = function(this: ExtendedXHR, method: string, url: string | URL, ...rest: unknown[]) {
      this._method = method;
      this._url = url;
      this._startTime = performance.now();
      const [async_ = true, username, password] = rest as [boolean | undefined, string | undefined, string | undefined];
      return xhrOpen.call(this, method, url, async_, username, password);
    };

    originalXHR.prototype.send = function(this: ExtendedXHR, body?: Document | XMLHttpRequestBodyInit | null) {
      const method = this._method;
      const url = this._url;
      const startTime = this._startTime ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const xhrRef = this;

      console.group(`%c[XHR ${method}]`, 'color: #00BCD4; font-weight: bold');
      console.log('URL:', url);
      console.log('Body:', body);

      this.addEventListener('load', () => {
        const duration = (performance.now() - startTime).toFixed(2);
        console.log(`%c← Response [${xhrRef.status}] ${duration}ms`,
          xhrRef.status >= 200 && xhrRef.status < 300 ? 'color: #4CAF50' : 'color: #F44336');

        try {
          const data = JSON.parse(xhrRef.responseText);
          console.log('Data:', data);
        } catch {
          console.log('Response:', xhrRef.responseText);
        }
        console.groupEnd();
      });

      this.addEventListener('error', () => {
        const duration = (performance.now() - startTime).toFixed(2);
        console.log(`%c[Error] ${duration}ms`, 'color: #F44336; font-weight: bold');
        console.groupEnd();
      });

      return xhrSend.call(this, body);
    };
  }

  private interceptClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      console.log(
        '%c[Click]',
        'color: #FF9800; font-weight: bold',
        {
          element: target.tagName,
          id: target.id || 'N/A',
          class: target.className || 'N/A',
          text: target.textContent?.slice(0, 50) || 'N/A',
          target,
        }
      );
    }, true);

    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      console.log(
        '%c[Input]',
        'color: #9C27B0; font-weight: bold',
        {
          element: target.tagName,
          name: target.name || 'N/A',
          value: target.value,
          type: target.type,
        }
      );
    }, true);
  }

  private interceptRouteChanges() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('%c[Route Change] pushState', 'color: #673AB7; font-weight: bold', args[2]);
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('%c[Route Change] replaceState', 'color: #673AB7; font-weight: bold', args[2]);
      return originalReplaceState.apply(this, args);
    };

    window.addEventListener('popstate', (event) => {
      console.log('%c[Route Change] popstate', 'color: #673AB7; font-weight: bold', {
        url: window.location.href,
        state: event.state,
      });
    });
  }

  private interceptLocalStorage() {
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    const originalClear = Storage.prototype.clear;

    Storage.prototype.setItem = function(key: string, value: string) {
      console.log('%c[Storage] SET', 'color: #009688; font-weight: bold', {
        storage: this === localStorage ? 'localStorage' : 'sessionStorage',
        key,
        value: value.length > 100 ? value.slice(0, 100) + '...' : value,
      });
      return originalSetItem.apply(this, [key, value]);
    };

    Storage.prototype.removeItem = function(key: string) {
      console.log('%c[Storage] REMOVE', 'color: #009688; font-weight: bold', {
        storage: this === localStorage ? 'localStorage' : 'sessionStorage',
        key,
      });
      return originalRemoveItem.apply(this, [key]);
    };

    Storage.prototype.clear = function() {
      console.log('%c[Storage] CLEAR', 'color: #009688; font-weight: bold', {
        storage: this === localStorage ? 'localStorage' : 'sessionStorage',
      });
      return originalClear.apply(this);
    };
  }

  private interceptPromises() {
    if (typeof window !== 'undefined' && 'PromiseRejectionEvent' in window) {
      window.addEventListener('rejectionhandled', (event) => {
        console.log('%c[Promise] Rejection Handled', 'color: #4CAF50; font-weight: bold', event.reason);
      });
    }
  }

  private monitorPerformance() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('%c[Performance] Long Task', 'color: #FF5722; font-weight: bold', {
              duration: `${entry.duration.toFixed(2)}ms`,
              name: entry.name,
              startTime: entry.startTime,
            });
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {
      // longtask может быть не поддержан
    }

    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as PerformanceResourceTiming).duration > 1000) {
          console.warn('%c[Performance] Slow Resource', 'color: #FF5722; font-weight: bold', {
            name: entry.name,
            duration: `${(entry as PerformanceResourceTiming).duration.toFixed(2)}ms`,
            type: (entry as PerformanceResourceTiming).initiatorType,
          });
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as NavigationTimingEntry;
        if (perfData) {
          console.group('%c[Performance] Page Load', 'color: #FF5722; font-weight: bold');
          console.log('DOM Content Loaded:', `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
          console.log('Load Complete:', `${perfData.loadEventEnd - perfData.loadEventStart}ms`);
          console.log('Total Time:', `${perfData.loadEventEnd - perfData.fetchStart}ms`);
          console.table({
            'DNS Lookup': (perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2) + 'ms',
            'TCP Connection': (perfData.connectEnd - perfData.connectStart).toFixed(2) + 'ms',
            'Request': (perfData.responseStart - perfData.requestStart).toFixed(2) + 'ms',
            'Response': (perfData.responseEnd - perfData.responseStart).toFixed(2) + 'ms',
            'DOM Processing': (perfData.domComplete - perfData.domLoading).toFixed(2) + 'ms',
          });
          console.groupEnd();
        }
      }, 0);
    });
  }
}

const devMonitor = new DevMonitor();

// ОТКЛЮЧЕНО по умолчанию. Для включения вызовите в консоли:
// import('@/utils/devMonitor').then(m => m.default.init())

export default devMonitor;
