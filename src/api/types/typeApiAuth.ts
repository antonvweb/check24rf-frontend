// typeApiAuth.ts
// Типы согласно API_DOCUMENTATION.md

// ──────────────────────────────────────────────
// Запросы / Ответы для основных эндпоинтов
// ──────────────────────────────────────────────

export interface SendCodeRequest {
    identifier: string; // телефон (79054455906) или email
}

export interface SendCodeResponse {
    success: boolean;
    message?: string;
    timestamp?: string; // ISO 8601
}

export interface VerifyRequest {
    identifier: string; // телефон или email
    code: string;       // код верификации (6 цифр)
    captchaToken?: string; // опционально, если требуется
}

/**
 * Данные авторизации согласно документации
 * POST /api/auth/verify response data
 */
export interface AuthResponseData {
    userId: string;
    phoneNumber?: string;
    email?: string;
}

export interface VerifyResponse {
    success: boolean;
    message?: string;
    data?: AuthResponseData;
    timestamp?: string; // ISO 8601
}

/**
 * Ответ refresh token endpoint
 * POST /api/auth/refresh
 */
export interface RefreshResponse {
    success: boolean;
    message?: string;
    data?: {
        accessToken: string;
    };
}

/**
 * Ответ validate token endpoint
 * GET /api/auth/validate
 */
export interface ValidateTokenResponse {
    success: boolean;
    message?: string;
    data?: boolean; // true если токен валиден
}

/**
 * Ответ logout endpoint
 * POST /api/auth/logout
 */
export interface LogoutResponse {
    success: boolean;
    message?: string;
}

// ──────────────────────────────────────────────
// Captcha
// ──────────────────────────────────────────────

export interface VerifyCaptchaRequest {
    captchaToken: string;
}

export interface VerifyCaptchaResponse {
    success: boolean;
    message?: string;
    data?: boolean;
}

/**
 * CSRF Token response
 * GET /api/auth/csrf-token
 */
export interface CsrfTokenResponse {
    success: boolean;
    data: {
        token: string;
        headerName: string; // "X-CSRF-TOKEN"
    };
}

// ──────────────────────────────────────────────
// Общие типы ошибок
// ──────────────────────────────────────────────

export interface AuthApiError {
    success: false;
    message: string;
    code?: string;
    status?: number;
}
