import axios, { AxiosError } from "axios";
import { tokenManager } from "@/utils/tokenManager";
import { logger } from "@/utils/logger";
// import { csrfTokenManager } from "@/utils/csrfTokenManager"; // Раскомментировать при готовности бэкенда

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    timeout: 30000, // 30 секунд timeout на запросы
    headers: {
        "Content-Type": "application/json"
    }
});

// Флаг для предотвращения одновременных refresh-запросов
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

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Получаем токен из tokenManager (в памяти)
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // CSRF Token (раскомментировать при готовности бэкенда)
        // const csrfToken = csrfTokenManager?.getToken();
        // if (csrfToken && config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        //     config.headers['X-CSRF-Token'] = csrfToken;
        // }
        
        logger.debug('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        logger.debug('API Response:', response.status, response.config.url);
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Игнорируем сам запрос refresh, чтобы избежать рекурсии
        if (originalRequest.url?.includes('/auth/refresh')) {
            isRefreshing = false;
            processQueue(error, null);

            // Очищаем токен и редиректим
            tokenManager.clearToken();
            if (typeof window !== "undefined") {
                window.location.href = "/start";
            }
            return Promise.reject(error);
        }

        // Обрабатываем только 401 ошибки
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Если refresh уже идет, добавляем запрос в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Делаем refresh запрос напрямую, без интерсептора
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data;

                if (!accessToken) {
                    throw new Error("No access token in refresh response");
                }

                // Сохраняем токен в tokenManager (в памяти)
                tokenManager.setAccessToken(accessToken);
                
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                isRefreshing = false;

                logger.info('Token refreshed successfully');
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr as AxiosError, null);
                isRefreshing = false;

                // Очищаем токен при ошибке refresh
                tokenManager.clearToken();
                if (typeof window !== "undefined") {
                    window.location.href = "/start";
                }
                return Promise.reject(refreshErr);
            }
        }

        logger.error('API Error:', error.response?.status, error.message, originalRequest.url);
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

export default api;
