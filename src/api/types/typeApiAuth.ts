// typeApiAuth.ts

// ──────────────────────────────────────────────
// Запросы / Ответы для основных эндпоинтов
// ──────────────────────────────────────────────

export interface SendCodeRequest {
    identifier: string; // телефон или email
}

export interface SendCodeResponse {
    success: boolean;
    message?: string;
    // иногда может возвращаться captchaRequired: true и т.п.
}

export interface VerifyRequest {
    identifier: string;
    code: string;
    captchaToken?: string; // опционально, если требуется
}

export interface AuthResponseData {
    accessToken: string;
    userId: string;
    phoneNumber?: string;
    email?: string;
    // если в теле возвращается refreshToken — добавь
    // refreshToken?: string;
}

export interface VerifyResponse {
    success: boolean;
    message?: string;
    data?: AuthResponseData;
}

export interface RefreshResponse {
    accessToken: string;
    // если при ротации возвращается новый refresh в теле
    // refreshToken?: string;
}

export interface ValidateTokenResponse {
    valid: boolean;
    userId?: string;
    exp?: number;
    // другие поля, которые возвращает /validate
}

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
}

// ──────────────────────────────────────────────
// Общие типы ошибок (опционально)
// ──────────────────────────────────────────────

export interface AuthApiError {
    success: false;
    message: string;
    code?: string;
    status?: number;
}