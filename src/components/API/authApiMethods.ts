import api from "@/lib/axios";
import {User} from "@/components/types/interfaces";

interface SendCodeResponse {
    phoneNumber: boolean;
}

interface VerifyCodeResponse {
    message: string;
}

interface LoginResponse {
    token: string;
    userId: string;
}

interface userIsLoggedInResponse {
    isActive: boolean;
}

interface TokenResponse {
    accessToken: string;
}

interface ChangeDataResponse {
    success: boolean;
    message: string;
    type: string;
    newValue: string;
}

export const authApiMethods = {
    sendCode: async (phoneNumber: string) => {
        const response = await api.post<SendCodeResponse>('/api/auth/send-code', {
            phoneNumber
        });
        return {
            data: response.data,
            status: response.status,
        };
    },
    verifyCode: async (phoneNumber: string, code: string) => {
        const response = await api.post<VerifyCodeResponse>('/api/auth/verify-code', {
            phoneNumber,
            code
        });
        return {
            data: response.data,
            status: response.status,
        };
    },
    loginUser: async (phoneNumber: string) => {
        const response = await api.post<LoginResponse>('/api/auth/login', {
            phoneNumber
        });
        return {
            data: response.data,
            status: response.status,
        };
    },
    refreshToken: async () => {
        const response = await api.post<TokenResponse>('/api/auth/refresh');
        return {
            data: response.data,
            status: response.status,
        };
    }

}

export const usersApiMethods = {
    userIsActive: async (token: string | null) => {
        if(token === null) return null;
        const response = await api.get<userIsLoggedInResponse>('/api/users/is-active', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            data: response.data,
            status: response.status,
        };
    },
    userById: async (token: string | null) => {
        if(token === null) return null;
        const response = await api.get<User>('/api/users/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            data: response.data,
            status: response.status,
        };
    },
    changeAltDataUser: async (phoneNumber: string, token: string | null, type: "phone" | "email") => {
        if (token === null) return null;

        const response = await api.post<ChangeDataResponse>(
            '/api/users/change-data',
            {
                type: type,
                data: phoneNumber
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            data: response.data,
            status: response.status,
        };
    },
}

export const subscribeApiMethods = {
    getTypes: async () => {
        const response = await api.get('/api/billing/subscription/types');

        return {
            data: response.data,
            status: response.status,
        };
    }
}