'use client'

import React from 'react';
import {ErrorPhoneValid} from "@/components/ui/loginUI/errorModule/ErrorPhoneValid";
import styles from "@/styles/start/authForm.module.css";
import {usePhoneChange} from "@/hooks/phoneChange";
import {useAuth} from "@/context/contextAuth";

interface PhoneInputProps {
    inputPhoneRef: React.RefObject<HTMLInputElement | null>;
}

export default function PhoneInput({inputPhoneRef}: PhoneInputProps) {
    const { handlePhoneChange, handleKeyDown, isRussianPhoneValid } = usePhoneChange({
        inputPhoneRef
    });

    const {
        phone,
    } = useAuth();

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