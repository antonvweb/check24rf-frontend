import { logger } from '@/utils/logger';

/**
 * CSRF Token Manager
 * 
 * ИНСТРУКЦИЯ ПО ИНТЕГРАЦИИ С БЭКЕНДОМ:
 * 
 * 1. Бэкенд должен предоставлять CSRF токен одним из способов:
 *    a) Через cookie: XSRF-TOKEN (HttpOnly: false, чтобы JS мог прочитать)
 *    b) Через отдельный endpoint: GET /api/auth/csrf-token
 *    c) В ответе на refresh/login запросе в поле csrfToken
 * 
 * 2. Бэкенд должен проверять заголовок X-CSRF-Token во всех mutating запросах
 *    (POST, PUT, PATCH, DELETE)
 * 
 * 3. Рекомендуемый формат токена:
 *    - Длина: 32-64 символа
 *    - Алфавит: A-Za-z0-9
 *    - Время жизни: сессия или 1 час
 * 
 * ПРИМЕР ИНТЕГРАЦИИ:
 * 
 * // В axios.ts раскомментировать:
 * import { csrfTokenManager } from '@/utils/csrfTokenManager';
 * 
 * // В request interceptor:
 * const csrfToken = csrfTokenManager.getToken();
 * if (csrfToken && shouldIncludeCsrfToken(config)) {
 *     config.headers['X-CSRF-Token'] = csrfToken;
 * }
 * 
 * // В response interceptor для refresh:
 * const newCsrfToken = response.headers['x-csrf-token'];
 * if (newCsrfToken) {
 *     csrfTokenManager.setToken(newCsrfToken);
 * }
 */

class CsrfTokenManagerClass {
    private csrfToken: string | null = null;
    private isCsrfEnabled = false;

    /**
     * Включить CSRF защиту
     */
    enable(): void {
        this.isCsrfEnabled = true;
    }

    /**
     * Выключить CSRF защиту
     */
    disable(): void {
        this.isCsrfEnabled = false;
    }

    /**
     * Проверить, включена ли CSRF защита
     */
    isEnabled(): boolean {
        return this.isCsrfEnabled;
    }

    /**
     * Установить CSRF токен
     */
    setToken(token: string): void {
        if (!token) {
            logger.warn('CsrfTokenManager: Attempted to set empty token');
            return;
        }
        this.csrfToken = token;
    }

    /**
     * Получить CSRF токен
     */
    getToken(): string | null {
        if (!this.isCsrfEnabled) {
            return null;
        }
        return this.csrfToken;
    }

    /**
     * Очистить CSRF токен
     */
    clearToken(): void {
        this.csrfToken = null;
    }

    /**
     * Извлечь CSRF токен из cookie
     * 
     * @param name - Имя cookie (по умолчанию XSRF-TOKEN)
     */
    extractFromCookie(name = 'XSRF-TOKEN'): string | null {
        if (typeof document === 'undefined') {
            return null;
        }

        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        
        if (parts.length === 2) {
            const token = parts.pop()?.split(';').shift();
            if (token) {
                this.setToken(token);
                return token;
            }
        }

        return null;
    }

    /**
     * Извлечь CSRF токен из meta тега
     * 
     * @param name - Имя meta тега (по умолчанию csrf-token)
     */
    extractFromMeta(name = 'csrf-token'): string | null {
        if (typeof document === 'undefined') {
            return null;
        }

        const element = document.querySelector(`meta[name="${name}"]`);
        if (element) {
            const token = element.getAttribute('content');
            if (token) {
                this.setToken(token);
                return token;
            }
        }

        return null;
    }

    /**
     * Инициализировать CSRF токен при загрузке приложения
     * 
     * @param options - Опции инициализации
     */
    async initialize(options?: {
        fromCookie?: string;
        fromMeta?: string;
        fromEndpoint?: string;
    }): Promise<boolean> {
        // Пытаемся получить токен из разных источников
        if (options?.fromCookie) {
            const token = this.extractFromCookie(options.fromCookie);
            if (token) {
                this.enable();
                return true;
            }
        }

        if (options?.fromMeta) {
            const token = this.extractFromMeta(options.fromMeta);
            if (token) {
                this.enable();
                return true;
            }
        }

        if (options?.fromEndpoint) {
            try {
                const response = await fetch(options.fromEndpoint, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.csrfToken || data.token;
                    if (token) {
                        this.setToken(token);
                        this.enable();
                        return true;
                    }
                }
            } catch (error) {
                logger.warn('CsrfTokenManager: Failed to fetch token from endpoint:', error);
            }
        }

        return false;
    }
}

// Экспортируем singleton instance
export const csrfTokenManager = new CsrfTokenManagerClass();

// Для тестов можно экспортировать класс
export { CsrfTokenManagerClass };
