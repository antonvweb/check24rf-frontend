/**
 * Валидатор номера телефона
 * 
 * Поддерживаемые форматы:
 * - +7 (XXX) XXX-XX-XX
 * - +7XXXXXXXXXX
 * - 8 (XXX) XXX-XX-XX
 * - 8XXXXXXXXXX
 * 
 * @param phone - Номер телефона для валидации
 * @returns Результат валидации
 */

export interface PhoneValidationResult {
    isValid: boolean;
    error?: string;
    normalized?: string; // Нормализованный формат: +7XXXXXXXXXX
}

/**
 * Проверка и нормализация телефона
 */
export function validatePhone(phone: string): PhoneValidationResult {
    if (!phone || typeof phone !== 'string') {
        return {
            isValid: false,
            error: 'Номер телефона обязателен',
        };
    }

    // Удаляем все нецифровые символы
    const digits = phone.replace(/\D/g, '');

    // Проверка длины
    if (digits.length < 10 || digits.length > 11) {
        return {
            isValid: false,
            error: 'Номер телефона должен содержать 10 или 11 цифр',
        };
    }

    // Обрабатываем разные форматы
    let normalizedPhone = digits;

    // Если начинается с 8, заменяем на 7
    if (digits.length === 11 && digits.startsWith('8')) {
        normalizedPhone = '7' + digits.slice(1);
    }

    // Если 10 цифр, добавляем 7 в начало
    if (digits.length === 10) {
        normalizedPhone = '7' + digits;
    }

    // Проверка, что это российский номер (начинается с 7)
    if (!normalizedPhone.startsWith('7')) {
        return {
            isValid: false,
            error: 'Поддерживаются только российские номера (+7)',
        };
    }

    // Проверка кода оператора (должен быть от 200 до 999)
    const operatorCode = parseInt(normalizedPhone.slice(1, 4), 10);
    if (operatorCode < 200 || operatorCode > 999) {
        return {
            isValid: false,
            error: 'Некорректный код оператора',
        };
    }

    return {
        isValid: true,
        normalized: '+' + normalizedPhone,
    };
}

/**
 * Быстрая проверка валидности (без нормализации)
 */
export function isPhoneValid(phone: string): boolean {
    return validatePhone(phone).isValid;
}

/**
 * Нормализовать телефон до формата +7XXXXXXXXXX
 */
export function normalizePhone(phone: string): string | null {
    const result = validatePhone(phone);
    return result.normalized || null;
}

/**
 * Форматировать телефон для отображения: +7 (XXX) XXX-XX-XX
 */
export function formatPhone(phone: string): string | null {
    const result = validatePhone(phone);
    if (!result.isValid || !result.normalized) {
        return null;
    }

    const digits = result.normalized.replace(/\D/g, '');
    
    // +7 (XXX) XXX-XX-XX
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}
