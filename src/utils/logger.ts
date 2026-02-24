/**
 * Logger - безопасное логирование для приложения
 * 
 * Предотвращает логирование sensitive данных:
 * - Телефоны
 * - Email
 * - Токены
 * - Персональные данные
 * 
 * Использование:
 * import { logger } from '@/utils/logger';
 * 
 * logger.info('Message', data);
 * logger.error('Error', error);
 * logger.warn('Warning', data);
 * logger.debug('Debug', data); // только в development
 */

// Типы логирования
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LoggerConfig {
    enabled: boolean;
    minLevel: LogLevel;
    maskSensitiveData: boolean;
}

// Конфигурация логгера
const config: LoggerConfig = {
    enabled: process.env.NODE_ENV === 'development',
    minLevel: 'info',
    maskSensitiveData: true,
};

// Уровни логирования для сравнения
const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// Паттерны для обнаружения sensitive данных
const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
    // JWT токены
    { pattern: /Bearer\s+[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*/gi, replacement: 'Bearer [TOKEN]' },
    { pattern: /[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*/g, replacement: '[JWT_TOKEN]' },
    
    // Телефоны (разные форматы)
    { pattern: /\+7\s*\(\d{3}\)\s*\d{3}-\d{2}-\d{2}/g, replacement: '+7 (***) ***-**-**' },
    { pattern: /\+7\d{10}/g, replacement: '+7**********' },
    { pattern: /8\s*\(\d{3}\)\s*\d{3}-\d{2}-\d{2}/g, replacement: '8 (***) ***-**-**' },
    { pattern: /\d{11}/g, replacement: '[PHONE]' }, // потенциальные телефоны
    
    // Email
    { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL]' },
    
    // ИНН (10 или 12 цифр)
    { pattern: /\b\d{10}\b/g, replacement: '[INN10]' },
    { pattern: /\b\d{12}\b/g, replacement: '[INN12]' },
];

/**
 * Маскировка sensitive данных в строке
 */
function maskSensitiveData(str: string): string {
    if (!config.maskSensitiveData) return str;
    
    let masked = str;
    for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
        masked = masked.replace(pattern, replacement);
    }
    return masked;
}

/**
 * Рекурсивная обработка объекта для маскировки sensitive данных
 */
function sanitizeObject<T>(obj: T, depth = 0): T {
    // Ограничиваем глубину рекурсии
    if (depth > 5) {
        return '[MAX_DEPTH]' as unknown as T;
    }

    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'string') {
        return maskSensitiveData(obj) as unknown as T;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, depth + 1)) as unknown as T;
    }

    if (typeof obj === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            // Пропускаем потенциально sensitive ключи
            const sensitiveKeys = ['password', 'secret', 'token', 'authorization', 'captcha'];
            if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
                result[key] = '[REDACTED]';
            } else {
                result[key] = sanitizeObject(value, depth + 1);
            }
        }
        return result as T;
    }

    return obj;
}

/**
 * Обработка аргументов перед логированием
 */
function sanitizeArgs(args: unknown[]): unknown[] {
    return args.map(arg => {
        if (typeof arg === 'string') {
            return maskSensitiveData(arg);
        }
        if (typeof arg === 'object' && arg !== null) {
            return sanitizeObject(arg);
        }
        return arg;
    });
}

/**
 * Проверка уровня логирования
 */
function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

/**
 * Основная функция логирования
 */
function log(level: LogLevel, ...args: unknown[]): void {
    if (!config.enabled || !shouldLog(level)) {
        return;
    }

    const sanitizedArgs = sanitizeArgs(args);
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
        case 'debug':
            console.debug(prefix, ...sanitizedArgs);
            break;
        case 'info':
            console.info(prefix, ...sanitizedArgs);
            break;
        case 'warn':
            console.warn(prefix, ...sanitizedArgs);
            break;
        case 'error':
            console.error(prefix, ...sanitizedArgs);
            break;
    }
}

/**
 * Публичный API логгера
 */
export const logger = {
    info: (...args: unknown[]) => log('info', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
    debug: (...args: unknown[]) => log('debug', ...args),
    
    /**
     * Включить/выключить логирование
     */
    setEnabled: (enabled: boolean) => {
        config.enabled = enabled;
    },
    
    /**
     * Установить минимальный уровень логирования
     */
    setMinLevel: (level: LogLevel) => {
        config.minLevel = level;
    },
    
    /**
     * Включить/выключить маскировку sensitive данных
     */
    setMaskSensitiveData: (mask: boolean) => {
        config.maskSensitiveData = mask;
    },
};

// Экспортируем для использования в production (ограниченно)
export const productionLogger = {
    error: (...args: unknown[]) => {
        if (config.maskSensitiveData) {
            console.error('[ERROR]', ...sanitizeArgs(args));
        } else {
            console.error('[ERROR]', ...args);
        }
    },
    warn: (...args: unknown[]) => {
        if (config.maskSensitiveData) {
            console.warn('[WARN]', ...sanitizeArgs(args));
        } else {
            console.warn('[WARN]', ...args);
        }
    },
};
