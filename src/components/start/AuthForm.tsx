import styles from "@/styles/start/authForm.module.css";
import PhoneInput from "@/components/ui/loginUI/PhoneInput";
import {CustomButtonSendCode} from "@/components/ui/loginUI/CustomButtonSendCode"
import React, {useRef} from "react";
import {useAuthFormContext} from "@/context/AuthFormProvider";
import {useTimer} from "@/hooks/useTimer";
import {useResetSendCode} from "@/hooks/useResetSendCode";


export const AuthForm = () => {
    const inputPhoneRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

    useResetSendCode();

    const {
        phone,
        checked,
        sendCode,
        isCaptchaVerified,
        isPhoneValid,
        setPhone,
        setIsPhoneValid,
        handleFormPhoneSubmit

    } = useAuthFormContext();

    const { seconds } = useTimer(10);

    return (
        <div className={styles.authForm}>
            <span className={styles.loginTitle}>Вход по номеру телефона</span>
            <div className={styles.numberPhone}>
                <span className={styles.numberPhoneLabel}>Номер телефона</span>
                <form onSubmit={handleFormPhoneSubmit} className={styles.numberPhoneForm}>
                    <PhoneInput phone={phone} setPhone={setPhone} inputRef={inputPhoneRef} setIsPhoneValid={setIsPhoneValid} />
                    <CustomButtonSendCode sendCode={sendCode} timer={seconds} checked={checked} isPhoneValid={isPhoneValid} isCaptchaVerified={isCaptchaVerified} />
                </form>
            </div>
        </div>
    )
}