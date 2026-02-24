/**
 * TokenManager - безопасное хранение JWT токена в памяти
 * 
 * Предотвращает XSS атаки, исключая хранение токена в localStorage.
 * Токен хранится только в памяти и теряется при перезагрузке страницы.
 * 
 * @see https://owasp.org/www-community/attacks/xss/
 */

interface TokenData {
    accessToken: string | null;
    expiresAt: number | null; // timestamp истечения токена
}

class TokenManagerClass {
    private token: TokenData = {
        accessToken: null,
        expiresAt: null,
    };

    /**
     * Установить access token
     */
    setAccessToken(token: string, expiresAt?: number): void {
        this.token.accessToken = token;
        this.token.expiresAt = expiresAt ?? this.extractExpiryFromToken(token);
    }

    /**
     * Получить access token
     */
    getAccessToken(): string | null {
        return this.token.accessToken;
    }

    /**
     * Проверить валидность токена
     */
    isTokenValid(): boolean {
        if (!this.token.accessToken || !this.token.expiresAt) {
            return false;
        }

        // Токен действителен, если текущее время меньше времени истечения
        // Добавляем буфер 30 секунд для предотвращения использования почти истекшего токена
        return Date.now() < (this.token.expiresAt - 30000);
    }

    /**
     * Очистить токен
     */
    clearToken(): void {
        this.token = {
            accessToken: null,
            expiresAt: null,
        };
    }

    /**
     * Извлечь время истечения из JWT токена
     */
    private extractExpiryFromToken(token: string): number {
        try {
            // JWT состоит из 3 частей: header.payload.signature
            const payload = token.split('.')[1];
            if (!payload) {
                // Если не удалось распарсить, устанавливаем короткое время жизни (5 минут)
                return Date.now() + 5 * 60 * 1000;
            }

            // Декодируем base64url
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const decoded = JSON.parse(jsonPayload);
            
            // exp в JWT указывается в секундах
            if (decoded.exp) {
                return decoded.exp * 1000; // конвертируем в миллисекунды
            }

            // Если exp нет, устанавливаем короткое время жизни
            return Date.now() + 5 * 60 * 1000;
        } catch (error) {
            console.error('TokenManager: Failed to parse token expiry:', error);
            return Date.now() + 5 * 60 * 1000;
        }
    }

    /**
     * Получить оставшееся время жизни токена в миллисекундах
     */
    getTimeUntilExpiry(): number {
        if (!this.token.expiresAt) {
            return 0;
        }
        return Math.max(0, this.token.expiresAt - Date.now());
    }
}

// Экспортируем singleton instance
export const tokenManager = new TokenManagerClass();

// Для тестов можно экспортировать класс
export { TokenManagerClass };
