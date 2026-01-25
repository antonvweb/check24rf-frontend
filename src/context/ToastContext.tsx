// context/ToastContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '@/components/ui/Toast';

interface ToastContextType {
    showToast: (type: "success" | "info" | "warning" | "danger", message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

interface ProviderProps {
    children: ReactNode;
}

interface ToastItem {
    id: number;
    type: "success" | "info" | "warning" | "danger";
    message: string;
}

export const ToastProvider = ({ children }: ProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (type: ToastItem["type"], message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);

        // Авто-удаление через 3 секунды
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast контейнер */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
            }}>
                {toasts.map(t => (
                    <Toast key={t.id} type={t.type} message={t.message} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
