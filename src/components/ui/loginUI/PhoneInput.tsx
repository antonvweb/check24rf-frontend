import React, {useState} from 'react';
import { formatPhoneRussianNumber, formatPhoneNumber } from '@/utils/formatPhoneNumber';
import {ErrorPhoneValid} from "@/components/ui/loginUI/errorModule/ErrorPhoneValid";
import styles from "@/styles/start/start.module.css";

interface PhoneInputProps {
    phone: string;
    setPhone: (phone: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    setIsPhoneValid: (isValid: boolean) => void;
}

export default function PhoneInput({phone, setPhone, inputRef, setIsPhoneValid}: PhoneInputProps) {
    const [isRussianPhoneValid, setIsRussianPhoneValid] = useState<boolean | null>(null);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const digits = raw.replace(/\D/g, '').replace(/^7|8/, '').slice(0, 10);
        const formatted = formatPhoneNumber(digits);
        const isValid = digits.length === 10 && formatPhoneRussianNumber(digits);

        setPhone(formatted);
        setIsRussianPhoneValid(isValid);
        setIsPhoneValid(isValid);

        // вычисляем новую позицию курсора
        requestAnimationFrame(() => {
            if (inputRef.current) {
                const nextIndex = formatted.indexOf('X');
                const cursorPos = nextIndex === -1 ? formatted.length : nextIndex;
                inputRef.current.setSelectionRange(cursorPos, cursorPos);
            }
        });
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Backspace' || !inputRef?.current) return;

        const cursorPos = inputRef.current.selectionStart ?? 0;

        const maskChars = ['+', '7', ' ', '(', ')', '-'];

        if (cursorPos === 0) {
            e.preventDefault();
            return;
        }

        let deletePos = cursorPos - 1;
        while (deletePos > 0 && maskChars.includes(phone[deletePos])) {
            deletePos--;
        }

        if (deletePos < 0 || maskChars.includes(phone[deletePos])) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        const digitsOnly = phone.replace(/\D/g, '').slice(0, 10).split('');

        const digitPositions: number[] = [];
        for (let i = 0; i < phone.length; i++) {
            if (/\d/.test(phone[i])) digitPositions.push(i);
        }

        const digitIndex = digitPositions.indexOf(deletePos);

        if (digitIndex === -1) {
            return;
        }

        digitsOnly.splice(digitIndex, 1);

        const newDigits = digitsOnly.join('');
        const formatted = formatPhoneNumber(newDigits);
        setPhone(formatted);

        const newDigitPositions: number[] = [];
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) newDigitPositions.push(i);
        }

        let newCursorPos: number;
        if (digitIndex === 0) {
            newCursorPos = formatted.indexOf('X') !== -1 ? formatted.indexOf('X') : formatted.length;
        } else {
            newCursorPos = newDigitPositions[digitIndex - 1] + 1;
        }

        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    return (
        <>
            <input
                ref={inputRef}
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