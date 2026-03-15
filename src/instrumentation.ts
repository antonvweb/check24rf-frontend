/**
 * Instrumentation Hook
 * Запускается при старте Next.js сервера
 */

// Node.js v25+ предоставляет localStorage как глобальный Proxy-объект
// без методов Web Storage API. Удаляем его для корректного SSR.
if (typeof window === 'undefined' && typeof globalThis.localStorage !== 'undefined') {
    const desc = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    if (desc?.configurable) {
        delete (globalThis as Record<string, unknown>).localStorage;
    }
}

export async function register() {
    if (process.env.NODE_ENV === 'development') {
        // Загружаем конфигурацию терминального логирования
        await import('../server-logging.config.js');

        // Динамически импортируем serverLogger только в dev
        const { serverLogger } = await import('./utils/serverLogger');

        serverLogger.banner();
        serverLogger.success('Next.js Dev Server запущен');
        serverLogger.info('Порт:', process.env.PORT || 3000);
        serverLogger.info('URL:', `http://localhost:${process.env.PORT || 3000}`);
        serverLogger.info('API Destination:', process.env.API_DESTINATION || 'не задан');
        serverLogger.separator();
    }
}
