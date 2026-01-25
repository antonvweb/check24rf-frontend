// mcoService.ts
import api from "@/api/axios"; // твой axios-инстанс с интерсепторами и withCredentials
import {
    ApiResponse,
    BindUserData,
    BindRequestStatus,
    SendNotificationPayload,
    SendNotificationData, BindEvent, UnboundUser, ReceiptsStats, ReceiptPageResponse,
} from "@/api/types/typesMcoService";

const BASE_URL = "/api/mco";

export const mcoService = {
    // ─── User Binding ───────────────────────────────────────────────

    bindUser: async (
        phone: string,
        permissionGroups: string = "DEFAULT"
    ): Promise<ApiResponse<BindUserData>> => {
        console.log(phone, permissionGroups);
        const response = await api.post<ApiResponse<BindUserData>>(
            `${BASE_URL}/bind-user`,
            null,
            { params: { phone, permissionGroups } }
        );
        return response.data;
    },

    bindUsersBatch: async (
        phones: string[]
    ): Promise<ApiResponse<{ requestId?: string }>> => {
        if (phones.length > 100) {
            throw new Error("Максимум 100 номеров в пакетном запросе");
        }
        const response = await api.post<ApiResponse<{ requestId?: string }>>(
            `${BASE_URL}/bind-users-batch`,
            phones
        );
        return response.data;
    },

    // ─── Bind Status & Events ───────────────────────────────────────

    getBindRequestStatus: async (
        requestId: string
    ): Promise<ApiResponse<BindRequestStatus>> => {
        const response = await api.get<ApiResponse<BindRequestStatus>>(
            `${BASE_URL}/bind-request-status`,
            { params: { requestId } }
        );
        return response.data;
    },

    getBindRequestsStatuses: async (
        requestIds: string[]
    ): Promise<ApiResponse<Record<string, BindRequestStatus>>> => {
        if (requestIds.length > 50) {
            throw new Error("Максимум 50 requestId в одном запросе");
        }
        const response = await api.post<
            ApiResponse<Record<string, BindRequestStatus>>
        >(`${BASE_URL}/bind-requests-statuses`, requestIds);
        return response.data;
    },

    getBindEvents: async (
        marker: string = "S_FROM_END"
    ): Promise<ApiResponse<BindEvent>> => {
        const response = await api.get(
            `${BASE_URL}/bind-events`,
            { params: { marker } }
        );
        return response.data;
    },

    getUnboundUsers: async (
        marker: string = "S_FROM_END"
    ): Promise<ApiResponse<UnboundUser>> => {
        const response = await api.get(
            `${BASE_URL}/unbound-users`,
            { params: { marker } }
        );
        return response.data;
    },

    // ─── Receipts ───────────────────────────────────────────────────

    syncUserReceipts: async (
        phone: string
    ): Promise<ApiResponse<{ syncedCount?: number }>> => {
        const response = await api.get(
            `${BASE_URL}/receipts/sync`,
            { params: { phone } }
        );
        return response.data;
    },

    getUserReceipts: async (
        phone: string,
        page: number = 0,
        size: number = 20
    ): Promise<ApiResponse<ReceiptPageResponse>> => {
        const response = await api.get(
            `${BASE_URL}/receipts/user`,
            { params: { phone, page, size } }
        );
        return response.data;
    },

    getReceiptsStats: async (): Promise<ApiResponse<ReceiptsStats>> => {
        const response = await api.get(`${BASE_URL}/receipts/stats`);
        return response.data;
    },

    // ─── Notifications ──────────────────────────────────────────────

    sendNotification: async (
        payload: SendNotificationPayload
    ): Promise<ApiResponse<SendNotificationData>> => {
        const response = await api.post<ApiResponse<SendNotificationData>>(
            `${BASE_URL}/send-notification`,
            payload
        );
        return response.data;
    },

    // ─── Health ─────────────────────────────────────────────────────

    health: async (): Promise<ApiResponse<{ status: "UP" | "DOWN" }>> => {
        const response = await api.get(`${BASE_URL}/health`);
        return response.data;
    },
};

// Опционально: пример составного метода (если часто используется)
export const bindAndCheckStatus = async (
    phone: string
): Promise<{ bindResult: ApiResponse<BindUserData>; status?: ApiResponse<BindRequestStatus> }> => {
    const bindResult = await mcoService.bindUser(phone);

    if (!bindResult.success || !bindResult.data?.requestId) {
        throw new Error("Не удалось получить requestId после привязки");
    }

    // Можно добавить небольшую задержку или polling, здесь просто один запрос
    const status = await mcoService.getBindRequestStatus(bindResult.data.requestId);

    return { bindResult, status };
};

export default mcoService;