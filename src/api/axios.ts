import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logger } from "@/utils/logger";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    _csrfRetry?: boolean;
    _startTime?: number;
}

// В development: пустой baseURL = запросы идут на /api/... (через Next.js API Route proxy)
// В production: тоже пустой = запросы идут через proxy, cookies same-origin
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

// ============================================================================
// CSRF Token Management
// Бэкенд отдаёт CSRF через GET /api/auth/csrf-token, а не через cookie.
// Header name приходит в ответе (обычно X-CSRF-TOKEN).
// ============================================================================
let csrfToken: string | null = null;
let csrfHeaderName: string = 'X-CSRF-TOKEN';
let csrfFetchPromise: Promise<void> | null = null;

async function fetchCsrfToken(): Promise<void> {
    if (csrfFetchPromise) {
        await csrfFetchPromise;
        return;
    }

    csrfFetchPromise = (async () => {
        try {
            // Используем чистый axios чтобы не попасть в interceptor-петлю
            const response = await axios.get(
                `${API_BASE_URL}/api/auth/csrf-token`,
                { withCredentials: true, timeout: 10000 }
            );
            if (response.data?.success && response.data?.data) {
                csrfToken = response.data.data.token;
                csrfHeaderName = response.data.data.headerName || 'X-CSRF-TOKEN';
            }
        } catch {
            // CSRF fetch failed — не блокируем, retry при 403
        } finally {
            csrfFetchPromise = null;
        }
    })();

    await csrfFetchPromise;
}

function resetCsrfToken() {
    csrfToken = null;
}

// ============================================================================
// Флаг для предотвращения одновременных refresh-запросов
// ============================================================================
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Уведомляет React-контекст об истечении сессии.
 */
function notifySessionExpired() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:session-expired"));
    }
}

// ============================================================================
// Request interceptor — CSRF токен + логирование
// ============================================================================
api.interceptors.request.use(
    async (config) => {
        const typedConfig = config as RetryableRequestConfig;
        typedConfig._startTime = Date.now();

        // Добавляем CSRF токен для мутирующих методов
        const method = config.method?.toUpperCase();
        if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            if (!csrfToken) {
                await fetchCsrfToken();
            }
            if (csrfToken && config.headers) {
                config.headers[csrfHeaderName] = csrfToken;
            }
        }

        // Логирование запроса
        logger.api.request(
            config.method?.toUpperCase() || 'GET',
            `${config.baseURL}${config.url}`,
            config.data
        );

        return config;
    },
    (error) => {
        logger.api.error('REQUEST', 'Failed to send request', error);
        return Promise.reject(error);
    }
);

// ============================================================================
// Response interceptor — refresh токена + CSRF retry + логирование
// ============================================================================
api.interceptors.response.use(
    (response) => {
        const config = response.config as RetryableRequestConfig;
        const duration = config._startTime ? Date.now() - config._startTime : 0;

        logger.api.response(
            config.method?.toUpperCase() || 'GET',
            `${config.baseURL}${config.url} [${duration}ms]`,
            response.status,
            response.data
        );

        return response;
    },
    async error => {
        const originalRequest = error.config as RetryableRequestConfig;

        // Логирование ошибки
        if (originalRequest) {
            const duration = originalRequest._startTime ? Date.now() - originalRequest._startTime : 0;
            logger.api.error(
                originalRequest.method?.toUpperCase() || 'UNKNOWN',
                `${originalRequest.baseURL}${originalRequest.url} [${duration}ms]`,
                {
                    status: error.response?.status,
                    message: error.response?.data?.message || error.message,
                }
            );
        }

        // Игнорируем сам запрос refresh, чтобы избежать рекурсии
        if (originalRequest?.url?.includes('/auth/refresh')) {
            isRefreshing = false;
            processQueue(error, null);
            notifySessionExpired();
            return Promise.reject(error);
        }

        // ================================================================
        // 403 — возможно протух CSRF токен, обновляем и повторяем
        // ================================================================
        if (error.response?.status === 403 && originalRequest && !originalRequest._csrfRetry) {
            originalRequest._csrfRetry = true;
            resetCsrfToken();
            await fetchCsrfToken();

            if (csrfToken) {
                originalRequest.headers[csrfHeaderName] = csrfToken;
                return api(originalRequest);
            }
        }

        // ================================================================
        // 401 — пробуем обновить access token через refresh
        // ================================================================
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { data } = response.data;
                const accessToken = data?.accessToken;

                if (!accessToken) {
                    throw new Error("No access token in refresh response");
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // После refresh нужен свежий CSRF
                resetCsrfToken();

                processQueue(null, accessToken);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr as AxiosError, null);
                isRefreshing = false;
                notifySessionExpired();
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export const isAxiosError = (error: unknown): error is AxiosError => {
    return typeof error === 'object' && error !== null && 'response' in error;
};

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Неизвестная ошибка';
};

export { resetCsrfToken };
export default api;
