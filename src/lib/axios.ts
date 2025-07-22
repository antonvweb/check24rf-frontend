import axios from "axios";
import { tryRefresh } from "@/utils/checkAuth"; // путь к вашей функции

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

// Добавляем обработку 401 ошибки
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Предотвращаем бесконечные циклы
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshed = await tryRefresh();
            if (refreshed) {
                const newToken = localStorage.getItem("jwt");
                if (newToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                }
                return api(originalRequest); // Повторяем оригинальный запрос
            } else {
                // Очистка и возможный редирект
                localStorage.removeItem("jwt");
                if (typeof window !== "undefined") {
                    window.location.href = "/admin"; // редирект на страницу входа
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
