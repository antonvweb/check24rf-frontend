import {useCallback, useRef} from "react";
import {usersApiMethods} from "@/components/API/authApiMethods";
import {useRouter} from "next/navigation";
import {useTokenRefresh} from "@/hooks/start/useTokenRefresh";
import {getErrorMessage} from "@/lib/axios";
import {isAxiosError} from "axios";


export const useGetUserWithActiveCheck = () => {
    const router = useRouter();
    const { refreshToken } = useTokenRefresh();
    const retryCountRef = useRef(0);

    const getUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.warn("Токен отсутствует");
                router.push("/start");
                return null;
            }

            // Сначала проверяем активность пользователя
            const isActiveResult = await usersApiMethods.userIsActive(token);

            if (!isActiveResult || isActiveResult.status !== 200 || !isActiveResult.data?.isActive) {
                console.warn("Пользователь не активен");
                localStorage.setItem('isActive', 'false');
                return null;
            }

            localStorage.setItem('isActive', 'true');

            // Теперь получаем данные пользователя
            const result = await usersApiMethods.userById(token);

            if (!result) {
                console.error("Получен null результат от API");
                return null;
            }

            const { data, status } = result;

            if (status === 200) {
                return data;
            }

            console.warn(`Неожиданный статус ответа: ${status}`);
            return null;

        } catch (error: unknown) { // ✅ Явно указываем тип
            console.error("Ошибка получения пользователя:", getErrorMessage(error));

            // Безопасная проверка на AxiosError
            if (isAxiosError(error) && error.response?.status === 401 && retryCountRef.current === 0) {
                retryCountRef.current++;
                console.log("Попытка обновить токен");

                const refreshSuccess = await refreshToken();

                if (refreshSuccess) {
                    return getUser();
                } else {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('isActive');
                    router.push("/start");
                }
            }

            return null;
        } finally {
            setTimeout(() => {
                retryCountRef.current = 0;
            }, 1000);
        }
    }, [router, refreshToken]);

    return { getUser };
};
