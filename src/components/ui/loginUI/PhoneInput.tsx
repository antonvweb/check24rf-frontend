import React from 'react';
import {ErrorPhoneValid} from "@/components/ui/loginUI/errorModule/ErrorPhoneValid";
import styles from "@/styles/start/authForm.module.css";
import {usePhoneChange} from "@/hooks/phoneChange";

interface PhoneInputProps {
    phone: string;
    setPhone: (phone: string) => void;
    inputPhoneRef: React.RefObject<HTMLInputElement>;
    setIsPhoneValid: (isValid: boolean) => void;
}

export default function PhoneInput({phone, setPhone, inputPhoneRef, setIsPhoneValid}: PhoneInputProps) {
    const { handlePhoneChange, handleKeyDown, isRussianPhoneValid } = usePhoneChange({
        phone,
        setPhone,
        setIsPhoneValid,
        inputPhoneRef
    });

    return (
        <>
            <input
                ref={inputPhoneRef}
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyDown}
                className={styles.numberPhoneInput}
            />
            <ErrorPhoneValid isPhoneValid={phone.replace(/\D/g, '').replace(/^7|8/, '').slice(0, 10).length === 10} isRussianPhoneValid={isRussianPhoneValid}/>
        </>
    );
}