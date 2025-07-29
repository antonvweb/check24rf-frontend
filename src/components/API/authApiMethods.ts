import api from "@/lib/axios";

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



export const authApiMethods = {
    sendCode: async (phoneNumber: string) => {
        const response = await api.post<SendCodeResponse>('/api/auth/send-code', {
            phoneNumber
        });
        return response.data;
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
}