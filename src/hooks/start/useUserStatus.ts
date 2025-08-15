
import { useTokenRefresh } from "@/hooks/start/useTokenRefresh";
import { useCallback, useRef } from "react";
import { usersApiMethods } from "@/components/API/authApiMethods";
import {useRouter} from "next/navigation";
import { getErrorMessage, isAxiosError } from "@/lib/axios";

export const useUserStatus = () => {
    const { refreshToken } = useTokenRefresh();
    const isCheckingRef = useRef(false); // Предотвращение множественных одновременных вызовов
    const retryCountRef = useRef(0); // Счетчик попыток
    const router = useRouter();

    const checkUserActive = useCallback(async (forceCheck = false): Promise<boolean> => {
        // Предотвращаем множественные одновременные вызовы
        if (isCheckingRef.current && !forceCheck) {
            return false;
        }

        isCheckingRef.current = true;

        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.warn("Токен отсутствует в localStorage");
                localStorage.setItem("isActive", "false");
                router.push("/start");
                return false;
            }
            
            const result = await usersApiMethods.userIsActive(token);

            if (!result) {
                console.error("Получен null результат от API");
                return false;
            }

            const { data, status } = result;

            if (status === 200 && data?.isActive !== undefined) {
                localStorage.setItem('isActive', data.isActive.toString());
                retryCountRef.current = 0; // Сбрасываем счетчик при успехе
                return true;
            }

            if (status === 401) {
                // Ограничиваем количество попыток refresh
                if (retryCountRef.current >= 2) {
                    console.error("Превышено максимальное количество попыток refresh токена");
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('isActive');
                    retryCountRef.current = 0;
                    return false;
                }

                retryCountRef.current++;
                const refreshSuccess = await refreshToken();

                if (refreshSuccess) {
                    // Используем флаг forceCheck для принудительного повторного вызова
                    isCheckingRef.current = false; // Разблокируем для повторного вызова
                    return checkUserActive(true);
                } else {
                    console.error("Не удалось обновить токен");
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('isActive');
                    retryCountRef.current = 0;
                    return false;
                }
            }

            console.warn(`Неожиданный статус ответа: ${status}`);
            return false;

        } catch (error: unknown) { // ✅ Явно указываем тип
            console.error("Ошибка при проверке активности пользователя:", getErrorMessage(error));

            // Безопасная проверка на AxiosError
            if (isAxiosError(error) && error.response?.status === 401 && retryCountRef.current < 2) {
                retryCountRef.current++;
                const refreshSuccess = await refreshToken();

                if (refreshSuccess) {
                    isCheckingRef.current = false;
                    return checkUserActive(true);
                }
            }

            localStorage.removeItem('accessToken');
            localStorage.removeItem('isActive');
            retryCountRef.current = 0;
            return false;
        } finally {
            isCheckingRef.current = false;
        }
    }, [refreshToken, router]);

    return { checkUserActive };
};
