import {useCallback, useState} from "react";
import {useAuthFormContext} from "@/context/AuthFormProvider";
import api from "@/lib/axios"
import { AxiosError } from 'axios';

interface CaptchaVerifyResponse {
    valid: boolean;
}

export const captchaApi = {
    verifyCaptcha: async (captchaToken: string): Promise<CaptchaVerifyResponse> => {
        const response = await api.post<CaptchaVerifyResponse>('/api/auth/verify-captcha', {
            captchaToken
        });
        return response.data;
    },
};

interface UseCaptchaReturn {
    captchaToken: string | null;
    isVerifying: boolean;
    verifyCaptcha: (token: string) => Promise<boolean>;
    resetCaptcha: () => void;
    error: string | null;
}

export const useCaptcha = (): UseCaptchaReturn => {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setIsCaptchaVerified } = useAuthFormContext();

    const verifyCaptcha = useCallback(async (token: string): Promise<boolean> => {
        if (!token) {
            setError('Token каптчи отсутствует');
            return false;
        }

        setIsVerifying(true);
        setError(null);

        try {
            const data = await captchaApi.verifyCaptcha(token);
            if (data) {
                setCaptchaToken(token);
                setIsCaptchaVerified(true);
                return true;
            } else {
                setError('Каптча не прошла проверку');
                setIsCaptchaVerified(false);
                return false;
            }
        } catch (err) {
            console.error('Ошибка проверки каптчи:', err);

            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.error ||
                    err.response?.data?.message ||
                    'Ошибка сети при проверке каптчи';
                setError(errorMessage);
            } else {
                setError('Неизвестная ошибка при проверке каптчи');
            }

            setIsCaptchaVerified(false);
            return false;
        } finally {
            setIsVerifying(false);
        }
    }, [setIsCaptchaVerified]);

    const resetCaptcha = useCallback(() => {
        setCaptchaToken(null);
        setIsCaptchaVerified(false);
        setError(null);
    }, [setIsCaptchaVerified]);

    return {
        captchaToken,
        isVerifying,
        verifyCaptcha,
        resetCaptcha,
        error,
    };
};