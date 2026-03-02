// userService.ts
// Сервис управления пользователями согласно API_DOCUMENTATION.md

import type {
    User,
    UserCreateRequest,
    UserCreateResponse,
    UserUpdateRequest,
    UserMeResponse,
    UserSearchParams,
    UsersListParams,
    UserListResponse,
    UserReceiptsResponse,
} from "@/api/types/typeApiUser";
import api from "@/api/axios";

const BASE_URL = "/api/users";

export const userService = {
    /**
     * Получение информации о текущем пользователе
     * GET /api/users/me
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<UserMeResponse>(`${BASE_URL}/me`);
        return response.data.data;
    },

    /**
     * Получение информации о пользователе по ID
     * GET /api/users/{userId}
     */
    getUserById: async (userId: string): Promise<User> => {
        const response = await api.get<User>(`${BASE_URL}/${userId}`);
        return response.data;
    },

    /**
     * Получение списка всех пользователей с пагинацией
     * GET /api/users
     */
    getUsersList: async (params?: UsersListParams): Promise<UserListResponse> => {
        const response = await api.get<UserListResponse>(BASE_URL, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 20,
                sortBy: params?.sortBy ?? 'createdAt',
                sortDir: params?.sortDir ?? 'desc',
            },
        });
        return response.data;
    },

    /**
     * Поиск пользователей по номеру телефона или email
     * GET /api/users/search
     */
    searchUsers: async (params: UserSearchParams): Promise<User[]> => {
        const response = await api.get<User[]>(`${BASE_URL}/search`, {
            params: { query: params.query },
        });
        return response.data;
    },

    /**
     * Создание нового пользователя
     * POST /api/users
     */
    createUser: async (data: UserCreateRequest): Promise<UserCreateResponse> => {
        const response = await api.post<UserCreateResponse>(BASE_URL, data);
        return response.data;
    },

    /**
     * Обновление информации о пользователе
     * PUT /api/users/{userId}
     */
    updateUser: async (userId: string, data: UserUpdateRequest): Promise<User> => {
        const response = await api.put<User>(`${BASE_URL}/${userId}`, data);
        return response.data;
    },

    /**
     * Деактивация пользователя (мягкое удаление)
     * PATCH /api/users/{userId}/deactivate
     */
    deactivateUser: async (userId: string): Promise<void> => {
        await api.patch(`${BASE_URL}/${userId}/deactivate`);
    },

    /**
     * Активация пользователя
     * PATCH /api/users/{userId}/activate
     */
    activateUser: async (userId: string): Promise<void> => {
        await api.patch(`${BASE_URL}/${userId}/activate`);
    },

    /**
     * Удаление пользователя полностью (жесткое удаление)
     * DELETE /api/users/{userId}
     */
    deleteUser: async (userId: string): Promise<void> => {
        await api.delete(`${BASE_URL}/${userId}`);
    },

    /**
     * Получение чеков пользователя
     * GET /api/users/{userId}/receipts
     */
    getUserReceipts: async (
        userId: string,
        page: number = 0,
        size: number = 20
    ): Promise<UserReceiptsResponse> => {
        const response = await api.get<UserReceiptsResponse>(
            `${BASE_URL}/${userId}/receipts`,
            { params: { page, size } }
        );
        return response.data;
    },

    /**
     * Проверка активности пользователя
     * GET /api/users/is-active
     */
    checkIsActive: async (): Promise<boolean> => {
        const response = await api.get<boolean>(`${BASE_URL}/is-active`);
        return response.data;
    },
};

export default userService;
