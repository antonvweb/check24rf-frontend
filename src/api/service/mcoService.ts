// mcoService.ts
import api from "@/api/axios";
import type {
    BindUserData,
    BindRequestStatus,
    SendNotificationPayload,
    SendNotificationData,
    BindEvent,
    UnboundUser,
    ReceiptsStats,
    ReceiptPageResponse,
    UnbindUserRequest,
} from "@/api/types/typesMcoService";
import type { ApiResponse } from "@/api/types/common";
import { MCO_LIMITS, MCO_MARKERS, MCO_PERMISSION_GROUPS } from "@/api/constants/mco";
import { retry } from "@/utils/retry";
import { isPhoneValid, normalizePhone } from "@/utils/validation/phone";
import { logger } from "@/utils/logger";

const BASE_URL = "/api/mco";

/**
 * Валидация номера телефона перед отправкой
 */
const validatePhoneOrThrow = (phone: string): string => {
    if (!isPhoneValid(phone)) {
        throw new Error("Некорректный номер телефона");
    }
    return normalizePhone(phone) ?? phone;
};

export const mcoService = {
    // ─── User Binding ───────────────────────────────────────────────

    bindUser: async (
        phone: string,
        permissionGroups: string = MCO_PERMISSION_GROUPS.DEFAULT
    ): Promise<ApiResponse<BindUserData>> => {
        const validPhone = validatePhoneOrThrow(phone);

        return retry(async () => {
            const response = await api.post<ApiResponse<BindUserData>>(
                `${BASE_URL}/bind-user`,
                null,
                { params: { phone: validPhone, permissionGroups } }
            );
            return response.data;
        }, {
            maxRetries: 2,
            onRetry: (attempt, error) => {
                logger.warn(`bindUser retry attempt ${attempt}:`, error);
            }
        });
    },

    bindUsersBatch: async (
        phones: string[]
    ): Promise<ApiResponse<{ requestId?: string }>> => {
        if (phones.length > MCO_LIMITS.BATCH_BIND_MAX) {
            throw new Error(`Максимум ${MCO_LIMITS.BATCH_BIND_MAX} номеров в пакетном запросе`);
        }

        // Валидируем все номера
        const validPhones = phones.map(phone => {
            const normalized = normalizePhone(phone);
            if (!normalized) {
                throw new Error(`Некорректный номер телефона: ${phone.slice(-4)}`);
            }
            return normalized;
        });

        return retry(async () => {
            const response = await api.post<ApiResponse<{ requestId?: string }>>(
                `${BASE_URL}/bind-users-batch`,
                validPhones
            );
            return response.data;
        });
    },

    // ─── Unbind User ────────────────────────────────────────────────

    unbindUser: async (
        phoneNumber: string,
        unbindReason: string
    ): Promise<ApiResponse<void>> => {
        const validPhone = validatePhoneOrThrow(phoneNumber);

        const response = await api.post<ApiResponse<void>>(
            `${BASE_URL}/unbind-user`,
            { phoneNumber: validPhone, unbindReason } as UnbindUserRequest
        );
        return response.data;
    },

    // ─── Bind Status & Events ───────────────────────────────────────

    getBindRequestStatus: async (
        requestId: string
    ): Promise<ApiResponse<BindRequestStatus>> => {
        return retry(async () => {
            const response = await api.get<ApiResponse<BindRequestStatus>>(
                `${BASE_URL}/bind-request-status`,
                { params: { requestId } }
            );
            return response.data;
        });
    },

    getBindRequestsStatuses: async (
        requestIds: string[]
    ): Promise<ApiResponse<Record<string, BindRequestStatus>>> => {
        if (requestIds.length > MCO_LIMITS.STATUSES_MAX) {
            throw new Error(`Максимум ${MCO_LIMITS.STATUSES_MAX} requestId в одном запросе`);
        }

        return retry(async () => {
            const response = await api.post<
                ApiResponse<Record<string, BindRequestStatus>>
            >(`${BASE_URL}/bind-requests-statuses`, requestIds);
            return response.data;
        });
    },

    getBindEvents: async (
        marker: string = MCO_MARKERS.FROM_END
    ): Promise<ApiResponse<BindEvent>> => {
        return retry(async () => {
            const response = await api.get(
                `${BASE_URL}/bind-events`,
                { params: { marker } }
            );
            return response.data;
        });
    },

    getUnboundUsers: async (
        marker: string = MCO_MARKERS.FROM_END
    ): Promise<ApiResponse<UnboundUser>> => {
        return retry(async () => {
            const response = await api.get(
                `${BASE_URL}/unbound-users`,
                { params: { marker } }
            );
            return response.data;
        });
    },

    // ─── Receipts ───────────────────────────────────────────────────

    syncUserReceipts: async (
        phone: string
    ): Promise<ApiResponse<{ syncedCount?: number }>> => {
        const validPhone = validatePhoneOrThrow(phone);

        return retry(async () => {
            const response = await api.get(
                `${BASE_URL}/receipts/sync`,
                { params: { phone: validPhone } }
            );
            return response.data;
        }, {
            maxRetries: 3, // Больше попыток для синхронизации
            initialDelay: 2000
        });
    },

    getUserReceipts: async (
        phone: string,
        page: number = 0,
        size: number = MCO_LIMITS.DEFAULT_PAGE_SIZE
    ): Promise<ApiResponse<ReceiptPageResponse>> => {
        const validPhone = validatePhoneOrThrow(phone);

        return retry(async () => {
            const response = await api.get(
                `${BASE_URL}/receipts/user`,
                { params: { phone: validPhone, page, size } }
            );
            return response.data;
        });
    },

    getReceiptsStats: async (): Promise<ApiResponse<ReceiptsStats>> => {
        return retry(async () => {
            const response = await api.get(`${BASE_URL}/receipts/stats`);
            return response.data;
        });
    },

    // ─── Notifications ──────────────────────────────────────────────

    sendNotification: async (
        payload: SendNotificationPayload
    ): Promise<ApiResponse<SendNotificationData>> => {
        // Валидируем телефон в payload
        const validPhone = validatePhoneOrThrow(payload.phoneNumber);

        const response = await api.post<ApiResponse<SendNotificationData>>(
            `${BASE_URL}/send-notification`,
            { ...payload, phoneNumber: validPhone }
        );
        return response.data;
    },

    // ─── Health ─────────────────────────────────────────────────────

    health: async (): Promise<ApiResponse<{ status: "UP" | "DOWN" }>> => {
        const response = await api.get(`${BASE_URL}/health`);
        return response.data;
    },
};

// Составной метод с retry логикой
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
