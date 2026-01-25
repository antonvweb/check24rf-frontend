import React, { useRef } from "react";
import styles from "@/styles/start/authForm.module.css";
import PhoneInput from "@/components/ui/loginUI/PhoneInput";
import { CustomButtonSendCode } from "@/components/ui/loginUI/CustomButtonSendCode";
import { useAuth } from "@/context/contextAuth";

export const AuthForm = () => {
    const inputPhoneRef = useRef<HTMLInputElement | null>(null);

    const {
        sendVerificationCode,
    } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendVerificationCode();
    };

    return (
        <div className={styles.authForm}>
            <span className={styles.loginTitle}>Вход по номеру телефона</span>
            <div className={styles.numberPhone}>
                <span className={styles.numberPhoneLabel}>Номер телефона</span>
                <form onSubmit={handleSubmit} className={styles.numberPhoneForm}>
                    <PhoneInput
                        inputPhoneRef={inputPhoneRef}
                    />
                    <CustomButtonSendCode/>
                </form>
            </div>
        </div>
    );
};