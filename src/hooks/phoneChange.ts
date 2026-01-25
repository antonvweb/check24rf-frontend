'use client'

import React, {useState} from "react";
import {formatPhoneNumber, formatPhoneRussianNumber} from "@/utils/start/formatPhoneNumber";
import {useAuth} from "@/context/contextAuth";

interface PhoneChangeProps {
    inputPhoneRef: React.RefObject<HTMLInputElement | null>;
}

export const usePhoneChange = ({inputPhoneRef} :PhoneChangeProps) => {
    const [isRussianPhoneValid, setIsRussianPhoneValid] = useState<boolean | null>(null);

    const {
        phone,
        setPhone,
        setIsPhoneValid
    } = useAuth();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Извлекаем все цифры, не удаляя '8' в середине номера
        const allDigits = raw.replace(/\D/g, '');
        // Проверяем, начинается ли номер с 7 или 8
        const firstDigit = allDigits[0] === '7' || allDigits[0] === '8' ? allDigits[0] : null;
        // Берем оставшиеся 10 цифр после кода страны
        const digits = firstDigit ? allDigits.slice(1).slice(0, 10) : allDigits.slice(0, 10);
        // Передаем в formatPhoneNumber полный номер, включая код страны
        const formatted = formatPhoneNumber(firstDigit ? firstDigit + digits : digits);
        const isValid = digits.length === 10 && formatPhoneRussianNumber(digits);

        console.log(formatted);
        setPhone(formatted);
        setIsRussianPhoneValid(isValid);
        setIsPhoneValid(isValid);

        // Вычисляем новую позицию курсора
        requestAnimationFrame(() => {
            if(inputPhoneRef) {
                if (inputPhoneRef.current) {
                    const nextIndex = formatted.indexOf('X');
                    const cursorPos = nextIndex === -1 ? formatted.length : nextIndex;
                    inputPhoneRef.current.setSelectionRange(cursorPos, cursorPos);
                }
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputPhoneRef?.current) return;

        const input = e.currentTarget;
        const cursorPos = input.selectionStart ?? 0;
        const maskChars = ['+', '7', '8', ' ', '(', ')', '-'];

        if (e.key !== 'Backspace' && e.key !== 'Delete') return;

        e.preventDefault();

        // Извлекаем все цифры из номера телефона
        const allDigits = phone.replace(/\D/g, '');
        const firstDigit = allDigits[0] === '7' || allDigits[0] === '8' ? allDigits[0] : null;
        const restDigits = firstDigit ? allDigits.slice(1).split('') : allDigits.split('');

        // Находим позиции всех цифр в строке
        const digitPositions: number[] = [];
        for (let i = 0; i < phone.length; i++) {
            if (/\d/.test(phone[i])) digitPositions.push(i);
        }

        if (e.key === 'Backspace') {
            if (cursorPos === 0 || restDigits.length === 0) return;

            // Удаляем последнюю цифру из restDigits
            restDigits.pop();

            const newDigits = firstDigit ? firstDigit + restDigits.join('') : restDigits.join('');
            const formatted = formatPhoneNumber(newDigits);
            setPhone(formatted);

            // Определяем новую позицию курсора
            const newDigitPositions: number[] = [];
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) newDigitPositions.push(i);
            }

            // Курсор ставим после последней цифры, если она есть, иначе на первый 'X' или конец строки
            let newCursorPos: number;
            if (newDigitPositions.length > 0) {
                newCursorPos = newDigitPositions[newDigitPositions.length - 1] + 1;
            } else {
                newCursorPos = formatted.indexOf('X') !== -1 ? formatted.indexOf('X') : formatted.length;
            }

            requestAnimationFrame(() => {
                if (inputPhoneRef.current) {
                    inputPhoneRef.current.setSelectionRange(newCursorPos, newCursorPos);
                }
            });

        } else if (e.key === 'Delete') {
            if (cursorPos >= phone.length || restDigits.length === 0) return;

            // Находим ходекс цифры, ближайшей к курсору
            let deletePos = cursorPos;
            while (deletePos < phone.length && maskChars.includes(phone[deletePos])) {
                deletePos++;
            }
            if (deletePos >= phone.length) return;

            const digitIndex = digitPositions.indexOf(deletePos);
            if (digitIndex === -1) return;

            // Запрещаем удалять первую цифру (код страны: "7" или "8")
            if (digitIndex === 0 && firstDigit && (firstDigit === '7' || firstDigit === '8')) return;

            const restDigitIndex = firstDigit ? digitIndex - 1 : digitIndex;
            restDigits.splice(restDigitIndex, 1);

            const newDigits = firstDigit ? firstDigit + restDigits.join('') : restDigits.join('');
            const formatted = formatPhoneNumber(newDigits);
            setPhone(formatted);

            // Определяем новую позицию курсора
            const newDigitPositions: number[] = [];
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) newDigitPositions.push(i);
            }

            // Курсор остаётся на той же позиции или смещается к следующей цифре
            const newCursorPos = newDigitPositions[digitIndex] ?? (formatted.indexOf('X') !== -1 ? formatted.indexOf('X') : formatted.length);

            requestAnimationFrame(() => {
                if (inputPhoneRef.current) {
                    inputPhoneRef.current.setSelectionRange(newCursorPos, newCursorPos);
                }
            });
        }
    };

    return {handlePhoneChange, handleKeyDown, isRussianPhoneValid}
}