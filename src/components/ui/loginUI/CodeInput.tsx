"use client";

import React, {useEffect, useRef, useState} from "react";
import {authApiMethods} from "@/components/API/authApiMethods";
import {useAuthFormContext} from "@/context/AuthFormProvider";
import {setAuthToken} from "@/utils/storage";
import {useRouter} from "next/navigation";

export function useCodeInput(){
    const [isCodeValid, setIsCodeValid] = useState(true);
    const [isCodeSuccess, setIsCodeSuccess] = useState(false);
    const [code, setCode] = useState<string>('');
    const [successTimer, setSuccessTimer] = useState(0);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const {phone} = useAuthFormContext()
    const router = useRouter();
    const [userId, setUserId] = useState<string>();

    useEffect(() => {
        if (successTimer === 0 && isCodeSuccess) {
            setAuthToken();
            router.prefetch(`/profile/${userId}`);
            router.push(`/profile/${userId}`);
        }
    }, [successTimer, isCodeSuccess, router, userId]);

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
        if (code === '' || code.length !== 6) {
            setIsCodeValid(true);
            setIsCodeSuccess(false);
            return;
        }

        const loginUser :() => Promise<boolean | null | undefined> = async () => {
            try {
                const {data, status} = await authApiMethods.loginUser(phone);

                if(status === 200) {
                    localStorage.setItem('accessToken', data.token);
                    setUserId(data.userId);
                    console.log(data);
                    return true;
                }
            } catch (error){
                console.error("Ошибка при входе", error);
                return false;
            }
        }

        const verify = async () => {
            try {
                const { status } = await authApiMethods.verifyCode(phone, code);

                if(status === 200) {
                    if(await loginUser()){
                        setIsCodeValid(true);
                        setIsCodeSuccess(true);
                        setSuccessTimer(3);
                    }
                }
            } catch (error) {
                setIsCodeValid(false);
                setIsCodeSuccess(false);
                console.error('Ошибка при валидации кода:', error);
            }
        };

        verify();

    }, [code, phone]);


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