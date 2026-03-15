// safeLocalStorage для хранения НЕчувствительных данных
// НЕ использовать для токенов, паролей и других секретов!
// Токены должны храниться в httpOnly cookies

// Проверка на существование настоящего localStorage в браузере
// Вычисляется лениво, чтобы избежать проблем с Node.js built-in localStorage
function isBrowser(): boolean {
    try {
        return typeof window !== 'undefined' &&
               typeof window.localStorage !== 'undefined' &&
               typeof window.localStorage.getItem === 'function';
    } catch {
        return false;
    }
}

export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (!isBrowser()) return null;
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        if (!isBrowser()) return;
        try {
            localStorage.setItem(key, value);
        } catch {
            // Handle error silently or log
        }
    },
    removeItem: (key: string): void => {
        if (!isBrowser()) return;
        try {
            localStorage.removeItem(key);
        } catch {
            // Handle error silently
        }
    },
    clear: (): void => {
        if (!isBrowser()) return;
        try {
            localStorage.clear();
        } catch {
            // Handle error silently
        }
    }
};
