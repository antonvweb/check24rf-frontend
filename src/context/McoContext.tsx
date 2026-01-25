"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { AxiosError } from "axios";
import { mcoService } from "@/api/service/mcoService";
import {
    BindUserData,
    BindRequestStatus,
    BindEvent,
    UnboundUser,
    ReceiptsStats,
    SendNotificationPayload,
    SendNotificationData, ReceiptPageResponse,
} from "@/api/types/typesMcoService";

// ============================================================================
// Типы
// ============================================================================

interface McoContextType {
    // Состояния
    bindData: BindUserData | null;
    bindStatus: BindRequestStatus | null;
    bindStatuses: Record<string, BindRequestStatus>;
    bindEvents: BindEvent[];
    unboundUsers: UnboundUser[];
    userReceipts: ReceiptPageResponse | null;
    receiptsStats: ReceiptsStats | null;
    notificationResult: SendNotificationData | null;
    healthStatus: "UP" | "DOWN" | null;

    isLoading: boolean;
    error: string | null;

    // User Binding
    bindUser: (phone: string, permissionGroups?: string) => Promise<boolean>;
    bindUsersBatch: (phones: string[]) => Promise<string | null>;
    bindAndCheck: (phone: string) => Promise<boolean>;

    // Bind Status & Events
    getBindRequestStatus: (requestId: string) => Promise<boolean>;
    getBindRequestsStatuses: (requestIds: string[]) => Promise<boolean>;
    getBindEvents: (marker?: string) => Promise<boolean>;
    getUnboundUsers: (marker?: string) => Promise<boolean>;

    // Receipts
    syncUserReceipts: (phone: string) => Promise<number | null>;
    getUserReceipts: (phone: string) => Promise<boolean>;
    getReceiptsStats: () => Promise<boolean>;

    // Notifications
    sendNotification: (payload: SendNotificationPayload) => Promise<boolean>;

    // Health
    checkHealth: () => Promise<boolean>;

    // Утилиты
    clearError: () => void;
    clearBindData: () => void;
    clearReceipts: () => void;
    reset: () => void;
}

const McoContext = createContext<McoContextType | undefined>(undefined);

// ============================================================================
// Провайдер
// ============================================================================

interface McoProviderProps {
    children: ReactNode;
}

export function McoProvider({ children }: McoProviderProps) {
    // ── Состояния ──────────────────────────────────────────────────
    const [bindData, setBindData] = useState<BindUserData | null>(null);
    const [bindStatus, setBindStatus] = useState<BindRequestStatus | null>(null);
    const [bindStatuses, setBindStatuses] = useState<Record<string, BindRequestStatus>>({});
    const [bindEvents, setBindEvents] = useState<BindEvent[]>([]);
    const [unboundUsers, setUnboundUsers] = useState<UnboundUser[]>([]);
    const [userReceipts, setUserReceipts] = useState<ReceiptPageResponse | null>(null);
    const [receiptsStats, setReceiptsStats] = useState<ReceiptsStats | null>(null);
    const [notificationResult, setNotificationResult] = useState<SendNotificationData | null>(null);
    const [healthStatus, setHealthStatus] = useState<"UP" | "DOWN" | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
    // User Binding
    // ============================================================================

    const bindUser = useCallback(async (
        phone: string,
        permissionGroups: string = "DEFAULT"
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.bindUser(phone, permissionGroups);

            if (response.success && response.data) {
                setBindData(response.data);
                return true;
            }

            setError(response.message || "Не удалось привязать пользователя");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при привязке пользователя");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const bindUsersBatch = useCallback(async (phones: string[]): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.bindUsersBatch(phones);

            if (response.success && response.data?.requestId) {
                return response.data.requestId;
            }

            setError(response.message || "Не удалось запустить пакетную привязку");
            return null;
        } catch (err) {
            handleError(err, "Ошибка при пакетной привязке");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const bindAndCheck = useCallback(async (phone: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const bindResult = await mcoService.bindUser(phone);

            if (!bindResult.success || !bindResult.data?.requestId) {
                setError(bindResult.message || "Не удалось привязать пользователя");
                return false;
            }

            setBindData(bindResult.data);

            // Проверяем статус привязки
            const statusResult = await mcoService.getBindRequestStatus(bindResult.data.requestId);

            if (statusResult.success && statusResult.data) {
                setBindStatus(statusResult.data);
            }

            return true;
        } catch (err) {
            handleError(err, "Ошибка при привязке и проверке статуса");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    // ============================================================================
    // Bind Status & Events
    // ============================================================================

    const getBindRequestStatus = useCallback(async (requestId: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.getBindRequestStatus(requestId);

            if (response.success && response.data) {
                setBindStatus(response.data);
                return true;
            }

            setError(response.message || "Не удалось получить статус");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при получении статуса привязки");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const getBindRequestsStatuses = useCallback(async (requestIds: string[]): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.getBindRequestsStatuses(requestIds);

            if (response.success && response.data) {
                setBindStatuses(response.data);
                return true;
            }

            setError(response.message || "Не удалось получить статусы");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при получении статусов привязок");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const getBindEvents = useCallback(async (marker: string = "S_FROM_END"): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.getBindEvents(marker);

            if (response.success && response.data) {
                // Предполагаем, что data - это массив событий
                setBindEvents(Array.isArray(response.data) ? response.data : [response.data]);
                return true;
            }

            setError(response.message || "Не удалось получить события привязки");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при получении событий привязки");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const getUnboundUsers = useCallback(async (marker: string = "S_FROM_END"): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.getUnboundUsers(marker);

            if (response.success && response.data) {
                setUnboundUsers(Array.isArray(response.data) ? response.data : [response.data]);
                return true;
            }

            setError(response.message || "Не удалось получить отвязанных пользователей");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при получении отвязанных пользователей");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    // ============================================================================
    // Receipts
    // ============================================================================

    const syncUserReceipts = useCallback(async (phone: string): Promise<number | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.syncUserReceipts(phone);

            if (response.success) {
                return response.data?.syncedCount ?? 0;
            }

            setError(response.message || "Не удалось синхронизировать чеки");
            return null;
        } catch (err) {
            handleError(err, "Ошибка при синхронизации чеков");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const getUserReceipts = useCallback(async (phone: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.getUserReceipts(phone);

            if (response.success && response.data) {
                setUserReceipts(response.data);
                return true;
            }

            setError(response.message || "Не удалось получить чеки пользователя");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при получении чеков пользователя");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const getReceiptsStats = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.getReceiptsStats();

            if (response.success && response.data) {
                setReceiptsStats(response.data);
                return true;
            }

            setError(response.message || "Не удалось получить статистику чеков");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при получении статистики чеков");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    // ============================================================================
    // Notifications
    // ============================================================================

    const sendNotification = useCallback(async (
        payload: SendNotificationPayload
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.sendNotification(payload);

            if (response.success && response.data) {
                setNotificationResult(response.data);
                return true;
            }

            setError(response.message || "Не удалось отправить уведомление");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при отправке уведомления");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    // ============================================================================
    // Health
    // ============================================================================

    const checkHealth = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mcoService.health();

            if (response.success && response.data) {
                setHealthStatus(response.data.status);
                return response.data.status === "UP";
            }

            setHealthStatus("DOWN");
            return false;
        } catch (err) {
            handleError(err, "Ошибка при проверке здоровья сервиса");
            setHealthStatus("DOWN");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    // ============================================================================
    // Утилиты
    // ============================================================================

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearBindData = useCallback(() => {
        setBindData(null);
        setBindStatus(null);
        setBindStatuses({});
        setBindEvents([]);
    }, []);

    const clearReceipts = useCallback(() => {
        setUserReceipts(null);
        setReceiptsStats(null);
    }, []);

    const reset = useCallback(() => {
        setBindData(null);
        setBindStatus(null);
        setBindStatuses({});
        setBindEvents([]);
        setUnboundUsers([]);
        setUserReceipts(null);
        setReceiptsStats(null);
        setNotificationResult(null);
        setHealthStatus(null);
        setError(null);
    }, []);

    // ============================================================================
    // Значение контекста
    // ============================================================================

    const value: McoContextType = {
        // Состояния
        bindData,
        bindStatus,
        bindStatuses,
        bindEvents,
        unboundUsers,
        userReceipts,
        receiptsStats,
        notificationResult,
        healthStatus,
        isLoading,
        error,

        // User Binding
        bindUser,
        bindUsersBatch,
        bindAndCheck,

        // Bind Status & Events
        getBindRequestStatus,
        getBindRequestsStatuses,
        getBindEvents,
        getUnboundUsers,

        // Receipts
        syncUserReceipts,
        getUserReceipts,
        getReceiptsStats,

        // Notifications
        sendNotification,

        // Health
        checkHealth,

        // Утилиты
        clearError,
        clearBindData,
        clearReceipts,
        reset,
    };

    return <McoContext.Provider value={value}>{children}</McoContext.Provider>;
}

// ============================================================================
// Хук
// ============================================================================

export function useMco() {
    const context = useContext(McoContext);
    if (!context) {
        throw new Error("useMco must be used within McoProvider");
    }
    return context;
}