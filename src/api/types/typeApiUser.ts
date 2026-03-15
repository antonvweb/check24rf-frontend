// typeApiUser.ts
// Типы согласно API_DOCUMENTATION.md

// ──────────────────────────────────────────────
// Запросы / Ответы
// ──────────────────────────────────────────────

/**
 * Запрос создания пользователя
 * POST /api/users
 */
export interface UserCreateRequest {
    phoneNumber?: string;       // 79054455906 (обязательно)
    phoneNumberAlt?: string;    // 79991234567
    email?: string;             // user@example.com
    emailAlt?: string;
    telegramChatId?: string;
    isActive?: boolean;
}

export interface UserCreateResponse {
    success: boolean;
    message?: string;
    data: UserDetailResponse;
}

/**
 * Запрос обновления пользователя
 * PUT /api/users/{userId}
 */
export interface UserUpdateRequest {
    phoneNumberAlt?: string;
    email?: string;
    emailAlt?: string;
    telegramChatId?: string;
    isActive?: boolean;
}

/**
 * Детальная информация о пользователе
 * GET /api/users/me, GET /api/users/{userId}
 */
export interface UserDetailResponse {
    id?: string;                // UUID пользователя
    phoneNumber: string;
    phoneNumberAlt?: string;
    email?: string;
    emailAlt?: string;
    telegramChatId?: string;
    createdAt: string;      // ISO 8601
    isActive: boolean;
    partnerConnected: boolean;
}

/**
 * Краткая информация о пользователе (для списков)
 */
export interface UserSummary {
    id: string;             // UUID
    phoneNumber: string;
    email?: string;
    createdAt: string;
    isActive: boolean;
    receiptsCount: number;
}

/**
 * Ответ со списком пользователей
 * GET /api/users
 */
export interface UserListResponse {
    success: boolean;
    data: {
        users: UserSummary[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalElements: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
    };
}

/**
 * Параметры поиска пользователей
 * GET /api/users/search
 */
export interface UserSearchParams {
    query: string;
}

/**
 * Параметры пагинации
 */
export interface UsersListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

/**
 * Детали чека для пользователя
 */
export interface ReceiptDetail {
    id: string;
    fiscalDriveNumber: string;
    fiscalDocumentNumber: number;
    fiscalSign: number;
    receiptDateTime: string;    // ISO 8601
    receiveDate: string;        // ISO 8601
    totalSum: number;
    sourceCode: string;
    retailPlace: string;
    userInn: string;
    operationType: number;
}

/**
 * Ответ с чеками пользователя
 * GET /api/users/{userId}/receipts
 */
export interface UserReceiptsResponse {
    success: boolean;
    data: {
        userId: string;
        phoneNumber: string;
        receipts: ReceiptDetail[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalElements: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
        summary: {
            totalCount: number;
            totalAmount: number;
            averageAmount: number;
            oldestReceiptDate: string;
            newestReceiptDate: string;
        };
    };
}

/**
 * Основной тип пользователя (используется в приложении)
 */
export type User = UserDetailResponse;

/**
 * Ответ GET /api/users/me
 */
export interface UserMeResponse {
    success: boolean;
    data: UserDetailResponse;
    timestamp?: string;
}
