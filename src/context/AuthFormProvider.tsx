import React, {createContext, ReactNode, useContext} from 'react';
import {useAuthForm} from "@/hooks/start/useAuthForm";

// Создаем контекст
const AuthFormContext = createContext<ReturnType<typeof useAuthForm> | null>(null);

// Провайдер контекста
export const AuthFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const authForm = useAuthForm();

    return (
        <AuthFormContext.Provider value={authForm}>
            {children}
        </AuthFormContext.Provider>
    );
};

export const useAuthFormContext = () => {
    const context = useContext(AuthFormContext);
    if (!context) {
        throw new Error('useAuthFormContext must be used within AuthFormProvider');
    }
    return context;
};