/**
 * Validation utilities
 * 
 * @example
 * import { validators } from '@/utils/validation';
 * 
 * const phoneResult = validators.phone.validate('+7 (999) 123-45-67');
 * const emailResult = validators.email.validate('test@example.com');
 */

export * from './phone';
export * from './email';

import { validatePhone, isPhoneValid, normalizePhone, formatPhone } from './phone';
import { validateEmail, isEmailValid, normalizeEmail } from './email';

export const validators = {
    phone: {
        validate: validatePhone,
        isValid: isPhoneValid,
        normalize: normalizePhone,
        format: formatPhone,
    },
    email: {
        validate: validateEmail,
        isValid: isEmailValid,
        normalize: normalizeEmail,
    },
};
