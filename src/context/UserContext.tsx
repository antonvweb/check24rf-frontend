"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { AxiosError } from "axios";
import { userService } from "@/api/service/userService";
import type {
    User,
    UserUpdateRequest,
} from "@/api/types/typeApiUser";
import {useMco} from "@/context/McoContext";

// ============================================================================
// Типы
// ============================================================================

interface UserContextType {
    // Состояния
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;

    // Методы для текущего пользователя
    fetchCurrentUser: () => Promise<boolean>;
    updateCurrentUser: (data: UserUpdateRequest) => Promise<boolean>;
    checkIsActive: () => Promise<boolean>;

    // Утилиты
    clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============================================================================
// Провайдер
// ============================================================================

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    // ── Состояния ──────────────────────────────────────────────────
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { getUserReceipts } = useMco();

    // ============================================================================
    // Вспомогательная функция обработки ошибок
    // ============================================================================
    const handleError = useCallback((err: unknown, defaultMessage: string): string => {
        let message = defaultMessage;

        if (err instanceof AxiosError) {
            message = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                defaultMessage;
        } else if (err instanceof Error) {
            message = err.message;
        }

        setError(message);
        console.error(defaultMessage, err);
        return message;
    }, []);

    // ============================================================================
    // Методы для текущего пользователя
    // ============================================================================

    const fetchCurrentUser = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const user = await userService.getCurrentUser();
            setCurrentUser(user);
            if(user){
                await getUserReceipts(user?.phoneNumber);
            }
            return true;
        } catch (err) {
            handleError(err, "Не удалось загрузить профиль пользователя");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [getUserReceipts, handleError]);

    const updateCurrentUser = useCallback(async (data: UserUpdateRequest): Promise<boolean> => {
        if (!currentUser) {
            setError("Пользователь не загружен");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const updatedUser = await userService.updateUser(data);
            setCurrentUser(updatedUser);
            return true;
        } catch (err) {
            handleError(err, "Не удалось обновить профиль");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [currentUser, handleError]);

    const checkIsActive = useCallback(async (): Promise<boolean> => {
        try {
            const isActive = await userService.checkIsActive();

            setCurrentUser(prevUser => {
                if (!prevUser) return prevUser;

                return {
                    ...prevUser,
                    isActive,
                };
            });

            return isActive;
        } catch (err) {
            handleError(err, "Не удалось проверить статус активности");
            return false;
        }
    }, [handleError]);   // ← currentUser убираем из зависимостей

    // ============================================================================
    // Методы для работы со списком пользователей
    // ============================================================================


    // ============================================================================
    // Утилиты
    // ============================================================================

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // ============================================================================
    // Значение контекста
    // ============================================================================

    const value: UserContextType = {
        // Состояния
        currentUser,
        isLoading,
        error,

        // Методы для текущего пользователя
        fetchCurrentUser,
        updateCurrentUser,
        checkIsActive,

        // Методы для работы со списком
        clearError,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ============================================================================
// Хук
// ============================================================================

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}