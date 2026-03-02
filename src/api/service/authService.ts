// authService.ts
// Сервис аутентификации согласно API_DOCUMENTATION.md

import api from "@/api/axios";
import type {
    SendCodeRequest,
    SendCodeResponse,
    VerifyRequest,
    VerifyResponse,
    RefreshResponse,
    ValidateTokenResponse,
    LogoutResponse,
    VerifyCaptchaRequest,
    VerifyCaptchaResponse,
    CsrfTokenResponse,
} from "@/api/types/typeApiAuth";

const BASE_URL = "/api/auth";

export const authService = {
    /**
     * Отправка кода верификации на телефон или email
     * POST /api/auth/send-code
     */
    sendCode: async (data: SendCodeRequest): Promise<SendCodeResponse> => {
        const response = await api.post<SendCodeResponse>(`${BASE_URL}/send-code`, data);
        return response.data;
    },

    /**
     * Проверка кода и авторизация пользователя
     * POST /api/auth/verify
     * 
     * Устанавливает cookies: accessToken, refreshToken
     */
    verifyCode: async (data: VerifyRequest): Promise<VerifyResponse> => {
        const response = await api.post<VerifyResponse>(`${BASE_URL}/verify`, data);
        return response.data;
    },

    /**
     * Обновление access токена через refresh token
     * POST /api/auth/refresh
     * 
     * Refresh token автоматически передается из cookie
     */
    refreshToken: async (): Promise<RefreshResponse> => {
        const response = await api.post<RefreshResponse>(`${BASE_URL}/refresh`);
        return response.data;
    },

    /**
     * Проверка валидности access токена
     * GET /api/auth/validate
     * 
     * Authorization: Bearer <token> или cookie accessToken
     */
    validateToken: async (): Promise<ValidateTokenResponse> => {
        const response = await api.get<ValidateTokenResponse>(`${BASE_URL}/validate`);
        return response.data;
    },

    /**
     * Выход из системы (инвалидация токенов)
     * POST /api/auth/logout
     * 
     * Authorization: Bearer <token> или cookie accessToken
     */
    logout: async (): Promise<LogoutResponse> => {
        const response = await api.post<LogoutResponse>(`${BASE_URL}/logout`);
        return response.data;
    },

    /**
     * Получение CSRF токена
     * GET /api/auth/csrf-token
     */
    getCsrfToken: async (): Promise<CsrfTokenResponse> => {
        const response = await api.get<CsrfTokenResponse>(`${BASE_URL}/csrf-token`);
        return response.data;
    },

    /**
     * Проверка валидности капчи (опционально)
     * POST /api/auth/verify-captcha
     */
    verifyCaptcha: async (data: VerifyCaptchaRequest): Promise<VerifyCaptchaResponse> => {
        const response = await api.post<VerifyCaptchaResponse>(
            `${BASE_URL}/verify-captcha`,
            data
        );
        return response.data;
    },
};

/**
 * Удобная функция для полного логина в одну функцию
 */
export const loginWithCode = async (
    identifier: string,
    code: string,
    captchaToken?: string
): Promise<VerifyResponse> => {
    return authService.verifyCode({
        identifier,
        code,
        captchaToken,
    });
};

export default authService;
