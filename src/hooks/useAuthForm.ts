// @hooks/useAuthForm.ts
import React, {useReducer, useCallback, useRef, useEffect} from 'react';
import { safeLocalStorage } from '@/utils/storage';
import { TEST_CODE } from '@/components/types/constants';
import {useTimer} from "@/hooks/useTimer";
import api from "@/lib/axios";
import {authApiMethods} from "@/components/API/authApiMethods";

export interface AuthState {
    phone: string;
    isPhoneValid: boolean;
    isVisible: boolean;
    sendCode: boolean;
    checked: boolean;
    isCaptchaVerified: boolean;
    isOpenPersonalData: boolean;
}

export type AuthAction =
    | { type: 'SET_PHONE'; payload: string }
    | { type: 'SET_PHONE_VALID'; payload: boolean }
    | { type: 'SET_VISIBLE'; payload: boolean }
    | { type: 'SET_SEND_CODE'; payload: boolean }
    | { type: 'SET_CHECKED'; payload: boolean }
    | { type: 'SET_CAPTCHA_VERIFIED'; payload: boolean }
    | { type: 'SET_PERSONAL_DATA_MODAL'; payload: boolean }
    | { type: 'RESET_FORM' }
    | { type: 'START_CODE_SENDING' };

const initialState: AuthState = {
    phone: '',
    isPhoneValid: false,
    isVisible: false,
    sendCode: false,
    checked: false,
    isCaptchaVerified: false,
    isOpenPersonalData: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {

    let newState: AuthState;

    switch (action.type) {
        case 'SET_PHONE':
            newState = { ...state, phone: action.payload };
            break;

        case 'SET_PHONE_VALID':
            newState = { ...state, isPhoneValid: action.payload };
            break;

        case 'SET_VISIBLE':
            newState = { ...state, isVisible: action.payload };
            break;

        case 'SET_SEND_CODE':
            newState = { ...state, sendCode: action.payload };
            break;

        case 'SET_CHECKED':
            newState = { ...state, checked: action.payload };
            break;

        case 'SET_CAPTCHA_VERIFIED':
            newState = { ...state, isCaptchaVerified: action.payload };
            break;

        case 'SET_PERSONAL_DATA_MODAL':
            newState = { ...state, isOpenPersonalData: action.payload };
            break;

        case 'START_CODE_SENDING':
            newState = {
                ...state,
                sendCode: true,
                isVisible: true,
            };
            break;

        case 'RESET_FORM':
            newState = {
                ...initialState,
                phone: state.phone,
                isPhoneValid: state.isPhoneValid,
            };
            break;

        default:
            newState = state;
    }

    return newState
};

export const useAuthForm = () => {
    const { start } = useTimer(10);
    const [state, dispatch] = useReducer(authReducer, initialState);
    const inputPhoneRef = useRef<HTMLInputElement>(null);

    const setPhone = useCallback((phone: string) => {
        dispatch({ type: 'SET_PHONE', payload: phone });
    }, []);

    const setIsPhoneValid = useCallback((isValid: boolean) => {
        dispatch({ type: 'SET_PHONE_VALID', payload: isValid });
    }, []);

    const setIsVisible = useCallback((isVisible: boolean) => {
        dispatch({ type: 'SET_VISIBLE', payload: isVisible });
    }, []);

    const setSendCode = useCallback((sendCode: boolean) => {
        dispatch({ type: 'SET_SEND_CODE', payload: sendCode });
    }, []);

    const setChecked = useCallback((checked: boolean) => {
        dispatch({ type: 'SET_CHECKED', payload: checked });
    }, []);

    const setIsCaptchaVerified = useCallback((verified: boolean) => {
        dispatch({ type: 'SET_CAPTCHA_VERIFIED', payload: verified });
    }, []);

    const openPersonalDataModal = useCallback(() => {
        dispatch({ type: 'SET_PERSONAL_DATA_MODAL', payload: true });
    }, []);

    const closePersonalDataModal = useCallback(() => {
        dispatch({ type: 'SET_PERSONAL_DATA_MODAL', payload: false });
    }, []);

    const handleFormPhoneSubmit = useCallback(async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        // Проверяем все условия
        if (!state.isPhoneValid || !state.checked || !state.isCaptchaVerified || state.sendCode) {
            return;
        }
        try {
            const data = await authApiMethods.sendCode(state.phone);
            console.log(data);
            dispatch({ type: 'START_CODE_SENDING' });
            start();
            console.log('Отправка формы для телефона:', state.phone);
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            dispatch({ type: 'SET_SEND_CODE', payload: false });
        }
    }, [state.isPhoneValid, state.checked, state.isCaptchaVerified, state.sendCode, state.phone, start]);

    // Обработчик изменения чекбокса
    const handleCheckboxChange = useCallback((checked: boolean) => {
        setChecked(checked);
    }, [setChecked]);

    // Сброс состояния отправки кода по таймеру
    const resetSendCode = useCallback(() => {
        dispatch({ type: 'SET_SEND_CODE', payload: false });
    }, []);

    // Полный сброс формы
    const resetForm = useCallback(() => {
        dispatch({ type: 'RESET_FORM' });
    }, []);

    // Проверка возможности отправки формы
    const canSubmitForm = useCallback(() => {
        return state.isPhoneValid && state.checked && state.isCaptchaVerified && !state.sendCode;
    }, [state.isPhoneValid, state.checked, state.isCaptchaVerified, state.sendCode]);

    return {
        // Состояние
        ...state,
        inputPhoneRef,

        // Действия
        setPhone,
        setIsPhoneValid,
        setIsVisible,
        setSendCode,
        setChecked,
        setIsCaptchaVerified,
        openPersonalDataModal,
        closePersonalDataModal,

        // Обработчики
        handleFormPhoneSubmit,
        handleCheckboxChange,
        resetSendCode,
        resetForm,

        // Вычисляемые значения
        canSubmitForm: canSubmitForm(),
    };
};