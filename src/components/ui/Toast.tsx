// components/ui/Toast.tsx
import styles from '@/styles/ui/toast.module.css';

interface ToastProps {
    type: "success" | "info" | "warning" | "danger";
    message: string;
}

export const Toast = ({ type, message }: ToastProps) => {
    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            {message}
        </div>
    );
};
