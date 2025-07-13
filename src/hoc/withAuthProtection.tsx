"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Preloader from "@/components/Preloader";

function isLoggedInValid(): boolean {
    try {
        const stored = localStorage.getItem("isLoggedIn");
        if (!stored) return false;

        const { value, expiresAt } = JSON.parse(stored);
        return value === true && Date.now() < expiresAt;
    } catch {
        return false;
    }
}

// HOC с правильной типизацией
export function withAuthProtection<T extends object>(
    WrappedComponent: React.ComponentType<T>
): React.FC<T> {
    return function ProtectedComponent(props: T) {
        const router = useRouter();
        const pathname = usePathname();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const isValid = isLoggedInValid();

            if (!isValid && pathname !== "/") {
                router.replace("/start");
            } else {
                setIsLoading(false);
            }
        }, [pathname, router]);

        if (isLoading) {
            return <Preloader />;
        }

        return <WrappedComponent {...props} />;
    };
}
