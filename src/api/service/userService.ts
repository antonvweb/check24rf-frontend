// userService.ts
import type {
    User,
    UserCreateRequest,
    UserCreateResponse,
    UserUpdateRequest,
    UserMeResponse,
    UserSearchParams,
} from "@/api/types/typeApiUser";
import type { ApiResponse } from "@/api/types/common";
import type { ReceiptPageResponse } from "@/api/types/typesMcoService";
import api from "@/api/axios";

const BASE_URL = "/api/users";

export const userService = {
    // Создание пользователя (админ/спец права)
    createUser: async (data: UserCreateRequest): Promise<UserCreateResponse> => {
        const response = await api.post<UserCreateResponse>(BASE_URL, data);
        return response.data;
    },

    // Текущий пользователь (/me)
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<UserMeResponse>(`${BASE_URL}/me`);
        // Обрабатываем формат ответа { success, message, data }
        if ('data' in response.data && response.data.data) {
            return response.data.data;
        }
        return response.data as unknown as User;
    },

    // Пользователь по ID
    getUserById: async (userId: string): Promise<User> => {
        const response = await api.get<ApiResponse<User>>(`${BASE_URL}/${userId}`);
        // Обрабатываем формат ответа { success, message, data }
        if ('data' in response.data && response.data.data) {
            return response.data.data;
        }
        return response.data as unknown as User;
    },

    // Поиск по телефону/email
    searchUsers: async (params: UserSearchParams): Promise<User[]> => {
        const response = await api.get<User[]>(`${BASE_URL}/search`, {
            params: {
                query: params.query,
            },
        });
        return response.data;
    },

    // Обновление пользователя
    updateUser: async (data: UserUpdateRequest): Promise<User> => {
        const response = await api.put<User>(`${BASE_URL}`, data);
        return response.data;
    },

    // Удаление пользователя
    deleteUser: async (userId: string): Promise<void> => {
        await api.delete(`${BASE_URL}/${userId}`);
    },

    // ──────────────────────────────────────────────
    // Receipts endpoints (по документации API)
    // ──────────────────────────────────────────────

    /**
     * Получить чеки пользователя по userId
     * GET /api/users/{userId}/receipts
     */
    getUserReceipts: async (
        userId: string,
        page: number = 0,
        size: number = 20
    ): Promise<ApiResponse<ReceiptPageResponse>> => {
        const response = await api.get<ApiResponse<ReceiptPageResponse>>(
            `${BASE_URL}/${userId}/receipts`,
            { params: { page, size } }
        );
        return response.data;
    },

    // ──────────────────────────────────────────────
    // Legacy / дополнительные методы
    // ──────────────────────────────────────────────

    // Старый метод /user (legacy)
    getUserLegacy: async (): Promise<User> => {
        const response = await api.get<User>(`${BASE_URL}/user`);
        return response.data;
    },

    // Проверка активности
    checkIsActive: async (): Promise<boolean> => {
        const response = await api.get<boolean>(`${BASE_URL}/is-active`);
        return response.data;
    },

    // Legacy смена альтернативных данных (email/phoneAlt)
    changeAltData: async (payload: { type: "email" | "phone"; data: string }): Promise<void> => {
        await api.post(`${BASE_URL}/change-data`, payload);
    },
};

// Тип для ошибок (опционально, если хочешь централизованно обрабатывать)
export type UserApiError = {
    message: string;
    status?: number;
    code?: string;
};

export default userService;
