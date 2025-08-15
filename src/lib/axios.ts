import axios, {AxiosError} from "axios";

// Базовая настройка
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true, // отправка куки
    headers: {
        "Content-Type": "application/json"
    }
});

// Добавляем accessToken перед каждым запросом
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

export const isAxiosError = (error: unknown): error is AxiosError => {
    return typeof error === 'object' && error !== null && 'response' in error;
};

// Функция для безопасного получения сообщения об ошибке
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
