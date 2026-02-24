/**
 * Retry utility с exponential backoff для сетевых запросов
 * 
 * Использование:
 * import { retry } from '@/utils/retry';
 * 
 * const result = await retry(
 *   () => api.get('/endpoint'),
 *   { maxRetries: 3, initialDelay: 1000, maxDelay: 10000 }
 * );
 */

export interface RetryOptions {
    /** Максимальное количество попыток */
    maxRetries?: number;
    /** Начальная задержка в миллисекундах */
    initialDelay?: number;
    /** Максимальная задержка в миллисекундах */
    maxDelay?: number;
    /** Множитель экспоненциального роста */
    multiplier?: number;
    /** Функция для определения, стоит ли повторять запрос */
    shouldRetry?: (error: unknown) => boolean;
    /** Callback, вызываемый перед каждой попыткой */
    onRetry?: (attempt: number, error: unknown, delay: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    multiplier: 2,
    shouldRetry: isRetryableError,
    onRetry: () => {},
};

/**
 * Определить, является ли ошибка сетевой и стоит ли повторять запрос
 */
function isRetryableError(error: unknown): boolean {
    // Если это объект ошибки с кодом
    if (error && typeof error === 'object' && 'code' in error) {
        const code = (error as { code?: string }).code;
        // Сетевые ошибки
        if (code === 'ECONNRESET' || code === 'ENOTFOUND' || code === 'ETIMEDOUT') {
            return true;
        }
    }

    // Если это Axios error
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as { isAxiosError: boolean; code?: string; status?: number };
        
        // Сетевые ошибки без ответа сервера
        if (!axiosError.status && axiosError.code) {
            return true;
        }
        
        // 5xx ошибки сервера - можно пробовать снова
        if (axiosError.status && axiosError.status >= 500 && axiosError.status < 600) {
            return true;
        }
        
        // 429 Too Many Requests - можно пробовать снова
        if (axiosError.status === 429) {
            return true;
        }
    }

    // Ошибки сети без специфичного кода
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
            message.includes('network') ||
            message.includes('fetch') ||
            message.includes('timeout') ||
            message.includes('connection')
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Вычислить задержку для текущей попытки с exponential backoff и jitter
 */
function calculateDelay(
    attempt: number,
    initialDelay: number,
    maxDelay: number,
    multiplier: number
): number {
    // Exponential backoff: initialDelay * (multiplier ^ attempt)
    const exponentialDelay = initialDelay * Math.pow(multiplier, attempt);
    
    // Добавляем небольшой random jitter (±10%) для предотвращения thundering herd
    const jitter = (Math.random() - 0.5) * 0.2 * exponentialDelay;
    
    // Ограничиваем максимальную задержку
    return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Выполнить функцию с повторными попытками при ошибке
 * 
 * @param fn - Асинхронная функция для выполнения
 * @param options - Опции retry
 * @returns Результат выполнения функции
 * @throws Последнюю ошибку, если все попытки исчерпаны
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries,
        initialDelay,
        maxDelay,
        multiplier,
        shouldRetry,
        onRetry,
    } = { ...DEFAULT_OPTIONS, ...options };

    let lastError: unknown;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            attempt++;

            // Если это была последняя попытка или ошибка не retryable
            if (attempt > maxRetries || !shouldRetry(error)) {
                throw error;
            }

            // Вычисляем задержку
            const delay = calculateDelay(attempt - 1, initialDelay, maxDelay, multiplier);
            
            // Вызываем callback перед retry
            onRetry(attempt, error, delay);

            // Ждем перед следующей попыткой
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Должны выбросить ошибку, если дошли сюда
    throw lastError;
}

/**
 * Обертка для создания retryable версии функции
 * 
 * @param fn - Функция для обертки
 * @param options - Опции retry
 * @returns Обернутая функция с retry логикой
 */
export function withRetry<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    options: RetryOptions = {}
): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        return retry(() => fn(...args), options) as ReturnType<T>;
    }) as T;
}

/**
 * Retry с фиксированной задержкой (без exponential backoff)
 */
export async function retryWithFixedDelay<T>(
    fn: () => Promise<T>,
    options: RetryOptions & { fixedDelay?: number } = {}
): Promise<T> {
    const {
        maxRetries = 3,
        fixedDelay = 1000,
        shouldRetry = isRetryableError,
        onRetry = () => {},
    } = options;

    let lastError: unknown;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            attempt++;

            if (attempt > maxRetries || !shouldRetry(error)) {
                throw error;
            }

            onRetry(attempt, error, fixedDelay);
            await new Promise(resolve => setTimeout(resolve, fixedDelay));
        }
    }

    throw lastError;
}

export default retry;
