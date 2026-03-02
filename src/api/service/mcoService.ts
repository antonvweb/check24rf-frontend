// mcoService.ts
// Сервис интеграции с МЧО согласно API_DOCUMENTATION.md

import api from "@/api/axios";
import {
    ApiResponse,
    BindUserData,
    BindRequestStatus,
    BatchBindResult,
    BindEventsResponse,
    UnboundUsersResponse,
    UnbindUserRequest,
    UnbindUserResponse,
    ReceiptPageResponse,
    ReceiptsStats,
    SendNotificationPayload,
    SendNotificationData,
} from "@/api/types/typesMcoService";

const BASE_URL = "/api/mco";

export const mcoService = {
    // ============================================================================
    // User Binding (Подключение пользователя)
    // ============================================================================

    /**
     * Подключение пользователя к партнёру
     * POST /api/mco/bind-user
     */
    bindUser: async (
        phone: string,
        permissionGroups: string = "DEFAULT"
    ): Promise<ApiResponse<BindUserData>> => {
        const response = await api.post<ApiResponse<BindUserData>>(
            `${BASE_URL}/bind-user`,
            null,
            { params: { phone, permissionGroups } }
        );
        return response.data;
    },

    /**
     * Пакетное подключение пользователей
     * POST /api/mco/bind-users-batch
     */
    bindUsersBatch: async (
        phones: string[]
    ): Promise<ApiResponse<BatchBindResult>> => {
        if (phones.length > 100) {
            throw new Error("Максимум 100 номеров в пакетном запросе");
        }
        const response = await api.post<ApiResponse<BatchBindResult>>(
            `${BASE_URL}/bind-users-batch`,
            phones
        );
        return response.data;
    },

    // ============================================================================
    // Bind Status & Events
    // ============================================================================

    /**
     * Проверка статуса заявки на подключение
     * GET /api/mco/bind-request-status
     */
    getBindRequestStatus: async (
        requestId: string
    ): Promise<ApiResponse<BindRequestStatus>> => {
        const response = await api.get<ApiResponse<BindRequestStatus>>(
            `${BASE_URL}/bind-request-status`,
            { params: { requestId } }
        );
        return response.data;
    },

    /**
     * Получение событий подключения/отключения
     * GET /api/mco/bind-events
     */
    getBindEvents: async (
        marker: string = "S_FROM_END"
    ): Promise<ApiResponse<BindEventsResponse>> => {
        const response = await api.get<ApiResponse<BindEventsResponse>>(
            `${BASE_URL}/bind-events`,
            { params: { marker } }
        );
        return response.data;
    },

    /**
     * Получение списка отключившихся пользователей
     * GET /api/mco/unbound-users
     */
    getUnboundUsers: async (
        marker: string = "S_FROM_END"
    ): Promise<ApiResponse<UnboundUsersResponse>> => {
        const response = await api.get<ApiResponse<UnboundUsersResponse>>(
            `${BASE_URL}/unbound-users`,
            { params: { marker } }
        );
        return response.data;
    },

    // ============================================================================
    // Unbind (Отключение пользователя)
    // ============================================================================

    /**
     * Отключение пользователя от партнёра
     * POST /api/mco/unbind-user
     */
    unbindUser: async (
        data: UnbindUserRequest
    ): Promise<ApiResponse<UnbindUserResponse>> => {
        const response = await api.post<ApiResponse<UnbindUserResponse>>(
            `${BASE_URL}/unbind-user`,
            data
        );
        return response.data;
    },

    // ============================================================================
    // Receipts (Чеки)
    // ============================================================================

    /**
     * Получение чеков пользователя по телефону
     * GET /api/mco/receipts/user
     */
    getUserReceipts: async (
        phone: string,
        page: number = 0,
        size: number = 20,
        sort?: string
    ): Promise<ApiResponse<ReceiptPageResponse>> => {
        const response = await api.get<ApiResponse<ReceiptPageResponse>>(
            `${BASE_URL}/receipts/user`,
            { params: { phone, page, size, sort } }
        );
        return response.data;
    },

    /**
     * Синхронизация чеков пользователя
     * GET /api/mco/receipts/sync
     */
    syncUserReceipts: async (
        phone: string
    ): Promise<ApiResponse<{ syncedCount?: number }>> => {
        const response = await api.get<ApiResponse<{ syncedCount?: number }>>(
            `${BASE_URL}/receipts/sync`,
            { params: { phone } }
        );
        return response.data;
    },

    /**
     * Получение статистики по чекам
     * GET /api/mco/receipts/stats
     */
    getReceiptsStats: async (): Promise<ApiResponse<ReceiptsStats>> => {
        const response = await api.get<ApiResponse<ReceiptsStats>>(
            `${BASE_URL}/receipts/stats`
        );
        return response.data;
    },

    // ============================================================================
    // Notifications (Уведомления)
    // ============================================================================

    /**
     * Отправка уведомления пользователю
     * POST /api/mco/send-notification
     */
    sendNotification: async (
        payload: SendNotificationPayload
    ): Promise<ApiResponse<SendNotificationData>> => {
        const response = await api.post<ApiResponse<SendNotificationData>>(
            `${BASE_URL}/send-notification`,
            payload
        );
        return response.data;
    },

    /**
     * Получение списка всех типов уведомлений
     * GET /api/mco/notifications/demo/types
     */
    getNotificationTypes: async (): Promise<ApiResponse<{
        totalTypes: number;
        category: string;
        types: Array<{
            name: string;
            category: string;
            titleTemplate: string;
            messageTemplate: string;
            shortMessageTemplate: string;
            description: string;
        }>;
    }>> => {
        const response = await api.get<ApiResponse<{
            totalTypes: number;
            category: string;
            types: Array<{
                name: string;
                category: string;
                titleTemplate: string;
                messageTemplate: string;
                shortMessageTemplate: string;
                description: string;
            }>;
        }>>(`${BASE_URL}/notifications/demo/types`);
        return response.data;
    },

    // ============================================================================
    // Partner Registration (Регистрация партнёра)
    // ============================================================================

    /**
     * Регистрация партнёра в МЧО
     * POST /api/mco/register
     */
    registerPartner: async (
        logoPath?: string
    ): Promise<ApiResponse<{ partnerId: string }>> => {
        const response = await api.post<ApiResponse<{ partnerId: string }>>(
            `${BASE_URL}/register`,
            null,
            { params: { logoPath } }
        );
        return response.data;
    },

    // ============================================================================
    // Health Check
    // ============================================================================

    /**
     * Проверка здоровья сервиса
     * GET /api/mco/health
     */
    health: async (): Promise<ApiResponse<{ status: "UP" | "DOWN" }>> => {
        const response = await api.get<ApiResponse<{ status: "UP" | "DOWN" }>>(
            `${BASE_URL}/health`
        );
        return response.data;
    },

    // ============================================================================
    // WebSocket Testing (тестовые endpoints)
    // ============================================================================

    /**
     * Тестовое уведомление о новых чеках
     * POST /api/mco/test-websocket-notification
     */
    testWebSocketNotification: async (
        phone: string,
        count: number,
        totalAmount: string
    ): Promise<ApiResponse<{ phone: string; count: number; totalAmount: string }>> => {
        const response = await api.post<ApiResponse<{ phone: string; count: number; totalAmount: string }>>(
            `${BASE_URL}/test-websocket-notification`,
            null,
            { params: { phone, count, totalAmount } }
        );
        return response.data;
    },

    /**
     * Тестовое отключение пользователя
     * POST /api/mco/test-unbind-user
     */
    testUnbindUser: async (
        phone: string,
        reason: string
    ): Promise<ApiResponse<{ phone: string; reason: string; timestamp: string }>> => {
        const response = await api.post<ApiResponse<{ phone: string; reason: string; timestamp: string }>>(
            `${BASE_URL}/test-unbind-user`,
            null,
            { params: { phone, reason } }
        );
        return response.data;
    },
};

// ============================================================================
// Helper функции
// ============================================================================

/**
 * Комплексная функция: привязка и проверка статуса
 */
export const bindAndCheckStatus = async (
    phone: string
): Promise<{ bindResult: ApiResponse<BindUserData>; status?: ApiResponse<BindRequestStatus> }> => {
    const bindResult = await mcoService.bindUser(phone);

    if (!bindResult.success || !bindResult.data?.requestId) {
        throw new Error("Не удалось получить requestId после привязки");
    }

    const status = await mcoService.getBindRequestStatus(bindResult.data.requestId);

    return { bindResult, status };
};

export default mcoService;
