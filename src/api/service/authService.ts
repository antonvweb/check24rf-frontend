// apiAuth.ts
import api from "@/api/axios"; // твой axios-инстанс с withCredentials: true
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
} from "@/api/types/typeApiAuth";

const BASE_URL = "/api/auth";

export const authService = {
    // Отправка кода подтверждения (на телефон или email)
    sendCode: async (data: SendCodeRequest): Promise<SendCodeResponse> => {
        const response = await api.post<SendCodeResponse>(`${BASE_URL}/send-code`, data);
        return response.data;
    },

    // Проверка кода + аутентификация / регистрация
    verifyCode: async (data: VerifyRequest): Promise<VerifyResponse> => {
        const response = await api.post<VerifyResponse>(`${BASE_URL}/verify`, data);
        return response.data;
    },

    // Обновление access-токена (refresh-токен в httpOnly cookie)
    refreshToken: async (): Promise<RefreshResponse> => {
        try {
            const response = await api.post<RefreshResponse>(`${BASE_URL}/refresh`);
            if (!response.data?.accessToken) {
                throw new Error("No access token in refresh response");
            }
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    // Выход из системы
    logout: async (): Promise<LogoutResponse> => {
        const response = await api.post<LogoutResponse>(`${BASE_URL}/logout`);
        return response.data;
    },

    validateToken: async (): Promise<ValidateTokenResponse> => {
        const response = await api.get<ValidateTokenResponse>(`${BASE_URL}/validate`);
        return response.data;
    },

    verifyCaptcha: async (data: VerifyCaptchaRequest): Promise<VerifyCaptchaResponse> => {
        const response = await api.post<VerifyCaptchaResponse>(
            `${BASE_URL}/verify-captcha`,
            data
        );
        return response.data;
    },
};

// Опционально: удобный метод для полного логина в одну функцию
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

// Типизированная ошибка (если хочешь централизованно обрабатывать)
export type AuthApiError = {
    message: string;
    success?: false;
    status?: number;
};

export default authService;