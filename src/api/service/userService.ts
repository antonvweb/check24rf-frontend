// apiUser.ts
import type {
    User,
    UserCreateRequest,
    UserCreateResponse,
    UserUpdateRequest,
    UserMeResponse,
    UserSearchParams,
} from "@/api/types/typeApiUser";
import api from "@/api/axios";

// Базовый путь (можно вынести в env или константу)
const BASE_URL = "/api/users"; // предполагаем, что api уже имеет baseURL

export const userService = {
    // Создание пользователя (админ/спец права)
    createUser: async (data: UserCreateRequest): Promise<UserCreateResponse> => {
        const response = await api.post<UserCreateResponse>(BASE_URL, data);
        return response.data;
    },

    // Текущий пользователь (/me)
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<UserMeResponse>(`${BASE_URL}/me`);
        return response.data.data;
    },

    // Пользователь по ID
    getUserById: async (userId: string): Promise<User> => {
        const response = await api.get<User>(`${BASE_URL}/${userId}`);
        return response.data;
    },

    // Поиск по телефону/email
    searchUsers: async (params: UserSearchParams): Promise<User[]> => {
        // Предполагаем, что возвращается массив (если пагинированный — измени тип)
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