// typeApiUser.ts
export interface UserCreateRequest {
    phoneNumber?: string;
    email?: string;
}

export interface UserCreateResponse {
    id: string;           // или number — зависит от бэка
    phoneNumber: string;
    phoneNumberAlt?: string;
    email?: string;
    emailAlt?: string;
    telegramChatId?: string;
    createdAt?: string;
    isActive: boolean;
}

export interface UserUpdateRequest {
    email?: string;
    phoneNumberAlt?: string;
    // другие поля, которые можно обновлять
}

export interface User {
    phoneNumber: string;
    phoneNumberAlt?: string;
    email?: string;
    emailAlt?: string;
    telegramChatId?: string;
    createdAt?: string;
    active?: boolean;
    partnerConnected: boolean;
}

export interface UserMeResponse extends User {
    success: boolean;
    message: string;
    data: User;
    error: string;
    timestamp: string;
}

export interface PaginatedUsers {
    content: User[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface UserSearchParams {
    query: string;
}

export interface UsersListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}