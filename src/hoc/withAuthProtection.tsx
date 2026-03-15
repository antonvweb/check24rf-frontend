"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Preloader from "@/components/Preloader";
import { useAuth } from "@/context/contextAuth";

export function withAuthProtection<T extends object>(
    WrappedComponent: React.ComponentType<T>
): React.FC<T> {
    return function ProtectedComponent(props: T) {
        const router = useRouter();
        const pathname = usePathname();
        const { isAuthenticated, isLoading: authLoading } = useAuth();
        const [isChecking, setIsChecking] = useState(true);

        useEffect(() => {
            // Ждём завершения начальной проверки авторизации в AuthProvider
            if (authLoading) return;

            const isStartPage = pathname === "/start" || pathname === "/";

            if (isStartPage) {
                if (isAuthenticated) {
                    router.replace("/profile");
                } else {
                    setIsChecking(false);
                }
            } else {
                // Защищённая страница — доверяем состоянию из AuthProvider
                // AuthProvider уже проверил токен при монтировании,
                // а при логине isAuthenticated устанавливается напрямую
                if (!isAuthenticated) {
                    router.replace("/start");
                } else {
                    setIsChecking(false);
                }
            }
        }, [pathname, isAuthenticated, authLoading, router]);

        if (isChecking || authLoading) {
            return <Preloader />;
        }

        return <WrappedComponent {...props} />;
    };
}
