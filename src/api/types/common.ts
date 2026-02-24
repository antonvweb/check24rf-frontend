/**
 * Общие типы для API ответов и ошибок
 * 
 * Использование:
 * import type { ApiError, ApiResult } from '@/api/types/common';
 */

/**
 * Базовый формат ответа API
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T | null;
    error?: string | null;
    timestamp?: string;
}

/**
 * Формат ошибки API
 */
export interface ApiError {
    /** HTTP статус код */
    status?: number;
    /** Код ошибки (машинный) */
    code?: string;
    /** Сообщение для пользователя */
    message: string;
    /** Детали ошибки (опционально) */
    details?: Record<string, unknown>;
    /** Путь к эндпоинту, где произошла ошибка */
    path?: string;
    /** Timestamp ошибки */
    timestamp?: string;
}

/**
 * Успешный ответ API
 */
export interface ApiSuccess<T = unknown> {
    success: true;
    data: T;
    message?: string;
    timestamp?: string;
}

/**
 * Ответ API с пагинацией
 */
export interface PaginatedResponse<T = unknown> {
    success: boolean;
    message?: string;
    data: {
        content: T[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
        last: boolean;
        first: boolean;
        empty: boolean;
    };
    timestamp?: string;
}

/**
 * Тип для обработки ошибок в try/catch
 */
export type ApiResult<T> = 
    | { success: true; data: T }
    | { success: false; error: ApiError };

/**
 * Создать объект ApiError из различных типов ошибок
 */
export function createApiError(
    message: string,
    options?: Partial<ApiError>
): ApiError {
    return {
        message,
        status: options?.status,
        code: options?.code,
        details: options?.details,
        path: options?.path,
        timestamp: options?.timestamp ?? new Date().toISOString(),
    };
}

/**
 * Проверить, является ли объект ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
    );
}

/**
 * Проверить, является ли объект ApiResponse
 */
export function isApiResponse<T>(response: unknown): response is ApiResponse<T> {
    return (
        typeof response === 'object' &&
        response !== null &&
        'success' in response &&
        typeof (response as { success: unknown }).success === 'boolean'
    );
}

/**
 * Получить сообщение ошибки из различных форматов
 */
export function getErrorMessage(error: unknown, defaultMessage = 'Произошла ошибка'): string {
    if (typeof error === 'string') {
        return error;
    }
    
    if (error instanceof Error) {
        return error.message;
    }
    
    if (isApiError(error)) {
        return error.message;
    }
    
    if (isApiResponse(error) && !error.success) {
        return error.error as string ?? error.message ?? defaultMessage;
    }
    
    return defaultMessage;
}

/**
 * Коды ошибок API
 */
export enum ErrorCode {
    // Аутентификация
    UNAUTHORIZED = 'UNAUTHORIZED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    
    // Авторизация
    FORBIDDEN = 'FORBIDDEN',
    ACCESS_DENIED = 'ACCESS_DENIED',
    
    // Валидация
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',
    
    // Ресурсы
    NOT_FOUND = 'NOT_FOUND',
    RESOURCE_EXISTS = 'RESOURCE_EXISTS',
    
    // Сервер
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    TIMEOUT = 'TIMEOUT',
    
    // Сеть
    NETWORK_ERROR = 'NETWORK_ERROR',
    CONNECTION_ERROR = 'CONNECTION_ERROR',
}
