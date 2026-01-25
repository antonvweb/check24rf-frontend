import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
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
        const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Игнорируем сам запрос refresh, чтобы избежать рекурсии
        if (originalRequest.url?.includes('/auth/refresh')) {
            isRefreshing = false;
            processQueue(error, null);

            // Очищаем токен и редиректим
            localStorage.removeItem('jwt');
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

                localStorage.setItem('jwt', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr as AxiosError, null);
                isRefreshing = false;

                localStorage.removeItem('jwt');
                if (typeof window !== "undefined") {
                    window.location.href = "/start";
                }
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

export default api;