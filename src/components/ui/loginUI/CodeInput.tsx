"use client";

import React, {useEffect, useRef, useState} from "react";

export function useCodeInput(){
    const [isCodeValid, setIsCodeValid] = useState(true);
    const [isCodeSuccess, setIsCodeSuccess] = useState(false);
    const [code, setCode] = useState<string>('');
    const [successTimer, setSuccessTimer] = useState(0);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const focusNextInput = (index: number) => {
        const nextInput = inputsRef.current[index + 1];
        if (nextInput) nextInput.focus();
    };

    const focusPrevInput = (index: number) => {
        if (index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (!/^\d$/.test(value)) {
            return;
        }

        const newCode = code.split('');

        if (index !== 0 && newCode[0] === undefined) {
            newCode[0] = value;
            if (index + 1 < 6) {
                newCode[index] = '';
                inputsRef.current[index + 1]?.focus();
            }
        } else {
            newCode[index] = value;
            focusNextInput(index);
        }

        setCode(newCode.join(''));
    };

    const handleKeyDownCode = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (code[index]) {
                const newCode = code.split('');
                newCode[index] = '';
                setCode(newCode.join(''));
            } else {
                focusPrevInput(index);
            }
        }
    };

    useEffect(() => {
        const exeptionCode = localStorage.getItem('code');
        if (code === '' || code.length !== 6) {
            setIsCodeValid(true);
            setIsCodeSuccess(false);
            return;
        }

        if (code === exeptionCode) {
            setIsCodeValid(true);
            setIsCodeSuccess(true);
            setSuccessTimer(3);
        } else {
            setIsCodeValid(false);
            setIsCodeSuccess(false);
        }
    }, [code]);

    return {
        handleInput,
        handleKeyDownCode,
        isCodeValid,
        isCodeSuccess,
        successTimer,
        inputsRef,
        code,
        setCode,
        setSuccessTimer,
    };
}