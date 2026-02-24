/**
 * Валидатор email
 * 
 * @param email - Email для валидации
 * @returns Результат валидации
 */

export interface EmailValidationResult {
    isValid: boolean;
    error?: string;
    normalized?: string;
}

/**
 * RFC 5322 compatible email regex
 * Упрощенная версия для практического использования
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Проверка и нормализация email
 */
export function validateEmail(email: string): EmailValidationResult {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            error: 'Email обязателен',
        };
    }

    const trimmed = email.trim().toLowerCase();

    if (trimmed.length === 0) {
        return {
            isValid: false,
            error: 'Email не может быть пустым',
        };
    }

    if (trimmed.length > 254) {
        return {
            isValid: false,
            error: 'Email слишком длинный (максимум 254 символа)',
        };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return {
            isValid: false,
            error: 'Некорректный формат email',
        };
    }

    // Дополнительная проверка локальной части
    const [localPart, domain] = trimmed.split('@');
    
    if (!localPart || localPart.length > 64) {
        return {
            isValid: false,
            error: 'Некорректная локальная часть email',
        };
    }

    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return {
            isValid: false,
            error: 'Локальная часть не может начинаться или заканчиваться точкой',
        };
    }

    if (localPart.includes('..')) {
        return {
            isValid: false,
            error: 'Локальная часть не может содержать последовательные точки',
        };
    }

    // Проверка домена
    if (!domain || domain.length < 3) {
        return {
            isValid: false,
            error: 'Некорректный домен',
        };
    }

    if (domain.includes('..')) {
        return {
            isValid: false,
            error: 'Домен не может содержать последовательные точки',
        };
    }

    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
        return {
            isValid: false,
            error: 'Домен должен содержать доменную зону',
        };
    }

    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
        return {
            isValid: false,
            error: 'Некорректная доменная зона',
        };
    }

    return {
        isValid: true,
        normalized: trimmed,
    };
}

/**
 * Быстрая проверка валидности
 */
export function isEmailValid(email: string): boolean {
    return validateEmail(email).isValid;
}

/**
 * Нормализовать email (trim + lowercase)
 */
export function normalizeEmail(email: string): string | null {
    const result = validateEmail(email);
    return result.normalized || null;
}
