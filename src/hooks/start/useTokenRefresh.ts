import {useCallback} from "react";
import {authApiMethods} from "@/components/API/authApiMethods";

export const useTokenRefresh = () => {
    const refreshToken = useCallback(async (): Promise<boolean> => {
        try {
            const { data, status } = await authApiMethods.refreshToken();

            if (status === 200 && data?.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Ошибка при обновлении токена:", error);
            return false;
        }
    }, []);

    return { refreshToken };
};