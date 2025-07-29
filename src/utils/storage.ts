export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, value);
        } catch {
            // Handle error silently or log
        }
    }
};

export const setAuthToken = (expirationHours = 24) => {
    const expiresAt = Date.now() + expirationHours * 60 * 60 * 1000;
    safeLocalStorage.setItem("isLoggedIn", JSON.stringify({ value: true, expiresAt }));
};