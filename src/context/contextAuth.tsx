// src/context/AuthContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
// import { AxiosError } from "axios";
//
// import { authService } from "@/api/service/authService";
// import api from "@/api/axios";

// interface CaptchaVerifyResponse {
//     captchaToken: string;
// }

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    accessToken: string | null;

    phone: string;
    code: string[];
    isPhoneValid: boolean;
    agreedToTerms: boolean;
    codeSent: boolean;
    seconds: number;

    captchaToken: string | null;
    isCaptchaVerified: boolean;
    isVerifyingCaptcha: boolean;
    captchaError: string | null;

    setPhone: (phone: string) => void;
    setCode: (code: string[]) => void;
    setIsPhoneValid: (valid: boolean) => void;
    setAgreedToTerms: (agreed: boolean) => void;

    sendVerificationCode: () => Promise<boolean>;
    verifyCode: () => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    isTokenValid: (token: string | null) => boolean;

    verifyCaptcha: (token: string) => Promise<boolean>;
    resetCaptcha: () => void;

    resetForm: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const [phone, setPhone] = useState("");
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const [seconds, setSeconds] = useState(0);
    const startTimer = useCallback(() => setSeconds(60), []);
    const resetTimer = useCallback(() => setSeconds(0), []);

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
    const [captchaError, setCaptchaError] = useState<string | null>(null);

    // ============================================================================
    // Проверка валидности токена
    // ============================================================================
    const isTokenValid = useCallback((token: string | null): boolean => {
        if (!token) return false;
        try {
            const decoded: { exp: number } = jwtDecode(token);
            return Date.now() < decoded.exp * 1000;
        } catch {
            return false;
        }
    }, []);

    // ============================================================================
    // Простая проверка аутентификации (БЕЗ refresh)
    // ============================================================================
    const checkAuth = useCallback(async (): Promise<boolean> => {
        const token = localStorage.getItem("jwt");

        if (!token || !isTokenValid(token)) {
            setAccessToken(null);
            setIsAuthenticated(false);
            return false;
        }

        // Токен валиден
        setAccessToken(token);

        return true;
    }, [isTokenValid]);

    // ============================================================================
    // Инициализация при монтировании - ТОЛЬКО ПРОВЕРКА
    // ============================================================================
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await checkAuth();
            setIsLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ============================================================================
    // Отправка кода верификации
    // ============================================================================
    const sendVerificationCode = useCallback(async (): Promise<boolean> => {
        if (!isPhoneValid || !agreedToTerms || !captchaToken || codeSent) {
            return false;
        }

        // BACKEND DISABLED: Закомментирован запрос на бекенд
        // try {
        //     const cleanPhone = phone.replace(/\D/g, "");
        //     const response = await authService.sendCode({ identifier: cleanPhone });
        //
        //     if (response.success) {
        //         setCodeSent(true);
        //         startTimer();
        //         return true;
        //     }
        //     return false;
        // } catch (err) {
        //     console.error("Ошибка отправки кода:", err);
        //     return false;
        // }

        // MOCK: Имитация успешной отправки кода
        setCodeSent(true);
        startTimer();
        return true;
    }, [isPhoneValid, agreedToTerms, captchaToken, codeSent, phone, startTimer]);

    // ============================================================================
    // Проверка кода
    // ============================================================================
    const verifyCode = useCallback(async (): Promise<boolean> => {
        const codeString = code.join("");
        if (codeString.length !== 6) return false;

        // BACKEND DISABLED: Закомментирован запрос на бекенд
        // try {
        //     const cleanPhone = phone.replace(/\D/g, "");
        //     const response = await authService.verifyCode({
        //         identifier: cleanPhone,
        //         code: codeString,
        //         captchaToken: captchaToken || undefined,
        //     });
        //
        //     if (response.success && response.data?.accessToken) {
        //         const { accessToken: newToken } = response.data;
        //         localStorage.setItem("jwt", newToken);
        //         setAccessToken(newToken);
        //         setIsAuthenticated(true);
        //         return true;
        //     }
        //     return false;
        // } catch (err) {
        //     console.error("Ошибка верификации:", err);
        //     return false;
        // }

        // MOCK: Проверка кода 123456
        if (codeString === "123456") {
            // Создаём фейковый JWT токен (валидный на 24 часа)
            const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtb2NrLXVzZXItMTIzIiwiZXhwIjoyMDAwMDAwMDAwfQ.mock";
            localStorage.setItem("jwt", fakeToken);
            setAccessToken(fakeToken);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, [code, phone, captchaToken]);

    // ============================================================================
    // Выход
    // ============================================================================
    const logout = useCallback(async () => {
        // BACKEND DISABLED: Закомментирован запрос на бекенд
        // try {
        //     await authService.logout();
        // } catch (err) {
        //     console.warn("Logout error:", err);
        // } finally {
        //     localStorage.removeItem("jwt");
        //     setAccessToken(null);
        //     setIsAuthenticated(false);
        //     resetForm();
        // }

        // MOCK: Просто очищаем локальное состояние
        localStorage.removeItem("jwt");
        setAccessToken(null);
        setIsAuthenticated(false);
        resetForm();
    }, []);

    // ============================================================================
    // Сброс формы
    // ============================================================================
    const resetForm = useCallback(() => {
        setPhone("");
        setCode(Array(6).fill(""));
        setIsPhoneValid(false);
        setAgreedToTerms(false);
        setCodeSent(false);
        resetTimer();
        resetCaptcha();
    }, [resetTimer]);

    useEffect(() => {
        if (seconds === 0 && codeSent) {
            setCodeSent(false);
        }
    }, [seconds, codeSent]);

    // ============================================================================
    // Капча
    // ============================================================================
    const verifyCaptcha = useCallback(async (token: string): Promise<boolean> => {
        if (!token) {
            setCaptchaError("Token каптчи отсутствует");
            setIsCaptchaVerified(false);
            return false;
        }

        setIsVerifyingCaptcha(true);
        setCaptchaError(null);

        // BACKEND DISABLED: Закомментирован запрос на бекенд
        // try {
        //     const response = await api.post<CaptchaVerifyResponse>("/api/auth/verify-captcha", {
        //         captchaToken: token,
        //     });
        //
        //     if (response.status === 200) {
        //         setCaptchaToken(token);
        //         setIsCaptchaVerified(true);
        //         return true;
        //     }
        //
        //     setCaptchaError("Каптча не прошла проверку");
        //     setIsCaptchaVerified(false);
        //     return false;
        // } catch (err) {
        //     console.error("Ошибка проверки каптчи:", err);
        //
        //     let message = "Неизвестная ошибка при проверке каптчи";
        //     if (err instanceof AxiosError) {
        //         message =
        //             err.response?.data?.error ||
        //             err.response?.data?.message ||
        //             "Ошибка сети при проверке каптчи";
        //     }
        //
        //     setCaptchaError(message);
        //     setIsCaptchaVerified(false);
        //     return false;
        // } finally {
        //     setIsVerifyingCaptcha(false);
        // }

        // MOCK: Имитация успешной проверки капчи
        setCaptchaToken(token);
        setIsCaptchaVerified(true);
        setIsVerifyingCaptcha(false);
        return true;
    }, []);

    const resetCaptcha = useCallback(() => {
        setCaptchaToken(null);
        setIsCaptchaVerified(false);
        setCaptchaError(null);
        setIsVerifyingCaptcha(false);
    }, []);

    // ============================================================================
    // Таймер обратного отсчета
    // ============================================================================
    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [seconds]);

    const value: AuthContextType = {
        isAuthenticated,
        isLoading,
        accessToken,

        phone,
        code,
        isPhoneValid,
        agreedToTerms,
        codeSent,
        seconds,

        captchaToken,
        isCaptchaVerified,
        isVerifyingCaptcha,
        captchaError,

        setPhone,
        setCode,
        setIsPhoneValid,
        setAgreedToTerms,

        sendVerificationCode,
        verifyCode,
        logout,
        checkAuth,
        isTokenValid,

        verifyCaptcha,
        resetCaptcha,

        resetForm,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}