/**
 * Dev Logger Utility
 * Централизованная система логирования для режима разработки
 */

const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';
const logAPI = process.env.NEXT_PUBLIC_API_LOGGING === 'true';
const logStore = process.env.NEXT_PUBLIC_LOG_STORE_CHANGES === 'true';
const logPerformance = process.env.NEXT_PUBLIC_LOG_PERFORMANCE === 'true';
const logRenders = process.env.NEXT_PUBLIC_LOG_RENDERS === 'true';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class DevLogger {
  private prefix = '[Dev]';

  private shouldLog(category: string): boolean {
    if (!isDev) return false;

    switch (category) {
      case 'api':
        return logAPI;
      case 'store':
        return logStore;
      case 'performance':
        return logPerformance;
      case 'render':
        return logRenders;
      default:
        return isDebug;
    }
  }

  private formatMessage(category: string, message: string): string {
    return `${this.prefix}[${category.toUpperCase()}] ${message}`;
  }

  private getStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      log: 'color: #2196F3',
      info: 'color: #4CAF50',
      warn: 'color: #FF9800',
      error: 'color: #F44336; font-weight: bold',
      debug: 'color: #9C27B0',
    };
    return styles[level];
  }

  private logWithStyle(level: LogLevel, category: string, message: string, data?: unknown) {
    if (!this.shouldLog(category)) return;

    const formattedMessage = this.formatMessage(category, message);
    const style = this.getStyle(level);

    if (data !== undefined) {
      console[level](`%c${formattedMessage}`, style, data);
    } else {
      console[level](`%c${formattedMessage}`, style);
    }
  }

  // API логирование
  api = {
    request: (method: string, url: string, data?: unknown) => {
      this.logWithStyle('info', 'api', `→ ${method.toUpperCase()} ${url}`, data);
    },
    response: (method: string, url: string, status: number, data?: unknown) => {
      const level = status >= 400 ? 'error' : 'info';
      this.logWithStyle(level, 'api', `← ${method.toUpperCase()} ${url} [${status}]`, data);
    },
    error: (method: string, url: string, error: unknown) => {
      this.logWithStyle('error', 'api', `✗ ${method.toUpperCase()} ${url}`, error);
    },
  };

  // Store логирование
  store = {
    action: (storeName: string, action: string, payload?: unknown) => {
      this.logWithStyle('log', 'store', `${storeName}.${action}`, payload);
    },
    state: (storeName: string, state: unknown) => {
      this.logWithStyle('debug', 'store', `${storeName} state:`, state);
    },
  };

  // Performance логирование
  performance = {
    start: (label: string) => {
      if (!this.shouldLog('performance')) return;
      console.time(`[Performance] ${label}`);
    },
    end: (label: string) => {
      if (!this.shouldLog('performance')) return;
      console.timeEnd(`[Performance] ${label}`);
    },
    measure: (label: string, callback: () => void) => {
      if (!this.shouldLog('performance')) return () => callback();

      return () => {
        const start = performance.now();
        callback();
        const end = performance.now();
        console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
      };
    },
  };

  // Render логирование
  render = {
    component: (componentName: string, props?: unknown) => {
      this.logWithStyle('debug', 'render', `[Render] ${componentName}`, props);
    },
    effect: (componentName: string, dependencies: unknown[]) => {
      this.logWithStyle('debug', 'render', `[Effect] ${componentName} useEffect`, dependencies);
    },
  };

  // Общее логирование
  log = (message: string, data?: unknown) => {
    this.logWithStyle('log', 'general', message, data);
  };

  info = (message: string, data?: unknown) => {
    this.logWithStyle('info', 'general', message, data);
  };

  warn = (message: string, data?: unknown) => {
    this.logWithStyle('warn', 'general', message, data);
  };

  error = (message: string, data?: unknown) => {
    this.logWithStyle('error', 'general', message, data);
  };

  debug = (message: string, data?: unknown) => {
    this.logWithStyle('debug', 'general', message, data);
  };

  group = (label: string, callback: () => void) => {
    if (!isDev || !isDebug) {
      callback();
      return;
    }

    console.group(`${this.prefix} ${label}`);
    callback();
    console.groupEnd();
  };

  table = (data: unknown, columns?: string[]) => {
    if (!isDev || !isDebug) return;
    console.table(data, columns);
  };
}

export const logger = new DevLogger();

export function useRenderLogger(componentName: string, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_LOG_RENDERS === 'true') {
    logger.render.component(componentName, props);
  }
}
