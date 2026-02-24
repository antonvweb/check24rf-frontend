"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Preloader from "@/components/Preloader";
import { useAuth } from "@/context/contextAuth";
import { tokenManager } from "@/utils/tokenManager";

export function withAuthProtection<T extends object>(
    WrappedComponent: React.ComponentType<T>
): React.FC<T> {
    return function ProtectedComponent(props: T) {
        const router = useRouter();
        const pathname = usePathname();
        const { isTokenValid, checkAuth, isLoading: authLoading, accessToken } = useAuth();
        const [isChecking, setIsChecking] = useState(true);

        useEffect(() => {
            const checkAuthStatus = async () => {
                // Используем tokenManager вместо localStorage для безопасности
                const token = tokenManager.getAccessToken();
                const isValid = isTokenValid(token);

                const isStartPage = pathname === "/start" || pathname === "/";

                if (isStartPage) {
                    // Публичная страница (логин)
                    if (isValid) {
                        // Если уже авторизован - редирект на профиль
                        router.replace("/profile");
                    } else {
                        setIsChecking(false);
                    }
                } else {
                    // Защищенная страница
                    if (!isValid) {
                        // Токен невалиден - редирект на логин
                        router.replace("/start");
                    } else {
                        // Токен валиден - проверяем пользователя
                        const authSuccess = await checkAuth();
                        if (!authSuccess) {
                            router.replace("/start");
                        } else {
                            setIsChecking(false);
                        }
                    }
                }
            };

            checkAuthStatus();
        }, [pathname, isTokenValid, checkAuth, router, accessToken]);

        if (isChecking || authLoading) {
            return <Preloader />;
        }

        return <WrappedComponent {...props} />;
    };
}