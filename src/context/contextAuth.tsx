// src/context/contextAuth.tsx
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
import { AxiosError } from "axios";

import { authService } from "@/api/service/authService";
import type { AuthResponseData } from "@/api/types/typeApiAuth";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    accessToken: string | null;
    userId: string | null;
    phoneNumber: string | null;
    email: string | null;

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
    verifyCode: () => Promise<AuthResponseData | null>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    isTokenValid: (token: string | null) => boolean;

    verifyCaptcha: (token: string) => Promise<boolean>;
    resetCaptcha: () => void;

    resetForm: () => void;
    clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

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
    // Проверка аутентификации через API validate endpoint
    // Токены хранятся в httpOnly cookies, сервер сам их проверяет
    // ============================================================================
    const checkAuth = useCallback(async (): Promise<boolean> => {
        try {
            // Проверяем токен через API
            const response = await authService.validateToken();
            
            if (response.success && response.data === true) {
                setIsAuthenticated(true);
                // Токен валиден, но данные пользователя загрузим отдельно через UserContext
                return true;
            }
            
            // Токен не валиден
            setAccessToken(null);
            setUserId(null);
            setPhoneNumber(null);
            setEmail(null);
            setIsAuthenticated(false);
            return false;
        } catch {
            // Ошибка проверки токена - пользователь не аутентифицирован
            setAccessToken(null);
            setUserId(null);
            setPhoneNumber(null);
            setEmail(null);
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    // ============================================================================
    // Инициализация при монтировании - проверка токена
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

        try {
            const cleanPhone = phone.replace(/\D/g, "");
            const response = await authService.sendCode({ identifier: cleanPhone });

            if (response.success) {
                setCodeSent(true);
                startTimer();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Ошибка отправки кода:", err);
            return false;
        }
    }, [isPhoneValid, agreedToTerms, captchaToken, codeSent, phone, startTimer]);

    // ============================================================================
    // Проверка кода и аутентификация
    // Сервер устанавливает httpOnly cookies (accessToken, refreshToken)
    // ============================================================================
    const verifyCode = useCallback(async (): Promise<AuthResponseData | null> => {
        const codeString = code.join("");
        if (codeString.length !== 6) return null;

        try {
            const cleanPhone = phone.replace(/\D/g, "");
            const response = await authService.verifyCode({
                identifier: cleanPhone,
                code: codeString,
                captchaToken: captchaToken || undefined,
            });

            if (response.success && response.data) {
                const authData = response.data;
                
                // Сохраняем данные пользователя в контексте
                setAccessToken(authData.userId ? `user-${authData.userId}` : null);
                setUserId(authData.userId || null);
                setPhoneNumber(authData.phoneNumber || null);
                setEmail(authData.email || null);
                setIsAuthenticated(true);
                
                return authData;
            }
            return null;
        } catch (err) {
            console.error("Ошибка верификации:", err);
            return null;
        }
    }, [code, phone, captchaToken]);

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

        try {
            const response = await authService.verifyCaptcha({ captchaToken: token });

            if (response.success) {
                setCaptchaToken(token);
                setIsCaptchaVerified(true);
                return true;
            }

            setCaptchaError("Каптча не прошла проверку");
            setIsCaptchaVerified(false);
            return false;
        } catch (err) {
            console.error("Ошибка проверки каптчи:", err);

            let message = "Неизвестная ошибка при проверке каптчи";
            if (err instanceof AxiosError) {
                message =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Ошибка сети при проверке каптчи";
            }

            setCaptchaError(message);
            setIsCaptchaVerified(false);
            return false;
        } finally {
            setIsVerifyingCaptcha(false);
        }
    }, []);

    const resetCaptcha = useCallback(() => {
        setCaptchaToken(null);
        setIsCaptchaVerified(false);
        setCaptchaError(null);
        setIsVerifyingCaptcha(false);
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
    }, [resetTimer, resetCaptcha]);

    // ============================================================================
    // Очистка данных аутентификации
    // ============================================================================
    const clearAuthData = useCallback(() => {
        setAccessToken(null);
        setUserId(null);
        setPhoneNumber(null);
        setEmail(null);
        setIsAuthenticated(false);
    }, []);

    // ============================================================================
    // Выход из системы
    // ============================================================================
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.warn("Logout error:", err);
        } finally {
            clearAuthData();
            resetForm();
        }
    }, [clearAuthData, resetForm]);

    useEffect(() => {
        if (seconds === 0 && codeSent) {
            setCodeSent(false);
        }
    }, [seconds, codeSent]);

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
        userId,
        phoneNumber,
        email,

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
        clearAuthData,
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
