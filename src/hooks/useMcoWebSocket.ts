"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    WebSocketConnectionStatus,
    WebSocketServerMessage,
    WebSocketClientMessage,
    BindStatusMessage,
    NewReceiptsMessage,
    UnbindMessage,
    ErrorMessage,
    WebSocketCallbacks,
} from "@/api/types/typesMcoService";

interface UseMcoWebSocketReturn {
    // Состояние подключения
    status: WebSocketConnectionStatus;
    isConnected: boolean;

    // Последние полученные данные
    lastBindStatus: BindStatusMessage | null;
    lastNewReceipts: NewReceiptsMessage | null;
    lastUnbind: UnbindMessage | null;
    lastError: ErrorMessage | null;

    // Статистика
    reconnectAttempts: number;
    messagesReceived: number;

    // Методы
    subscribe: (requestId: string, phone: string) => void;
    disconnect: () => void;
    reconnect: () => void;
    clearMessages: () => void;
}

interface UseMcoWebSocketOptions extends WebSocketCallbacks {
    // URL WebSocket сервера
    url?: string;
    // Автоматическое подключение при монтировании
    autoConnect?: boolean;
    // Максимальное количество попыток переподключения
    maxReconnectAttempts?: number;
    // Задержка между попытками переподключения (мс)
    reconnectDelay?: number;
}

const DEFAULT_OPTIONS: Required<Omit<UseMcoWebSocketOptions, 'url' | 'onSubscribed' | 'onBindStatus' | 'onNewReceipts' | 'onUnbind' | 'onError' | 'onConnectionChange'>> = {
    autoConnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 3000,
};

/**
 * WebSocket хук для подключения к МЧО Сервису
 * 
 * Согласно API_DOCUMENTATION.md и WEBSOCKET_FRONTEND_GUIDE.md:
 * - URL: wss://api.xn--24-mlcu7d.xn--p1ai/api/mco/ws (production)
 * - URL: ws://localhost:80/api/mco/ws (development через Nginx)
 * 
 * Использует единый WebSocket endpoint /api/mco/ws для всех уведомлений:
 * - SUBSCRIBED - подтверждение подписки
 * - BIND_STATUS - статус подключения пользователя
 * - NEW_RECEIPTS - новые чеки
 * - UNBIND - отключение пользователя
 * - ERROR - ошибки
 *
 * @example
 * ```tsx
 * const { status, subscribe, lastBindStatus } = useMcoWebSocket({
 *     onBindStatus: (data) => {
 *         if (data.status === 'REQUEST_APPROVED') {
 *             console.log('Пользователь подключен!');
 *         }
 *     },
 *     onNewReceipts: (data) => {
 *         console.log(`Новые чеки: ${data.count} на сумму ${data.totalAmount}₽`);
 *     }
 * });
 *
 * // Подписка на уведомления
 * subscribe(requestId, phone);
 * ```
 */
export function useMcoWebSocket(options: UseMcoWebSocketOptions = {}): UseMcoWebSocketReturn {
    const {
        url = getWebSocketUrl(),
        autoConnect = DEFAULT_OPTIONS.autoConnect,
        maxReconnectAttempts = DEFAULT_OPTIONS.maxReconnectAttempts,
        reconnectDelay = DEFAULT_OPTIONS.reconnectDelay,
        onSubscribed,
        onBindStatus,
        onNewReceipts,
        onUnbind,
        onError,
        onConnectionChange,
    } = options;

    // Состояние подключения
    const [status, setStatus] = useState<WebSocketConnectionStatus>('disconnected');
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const [messagesReceived, setMessagesReceived] = useState(0);

    // Последние полученные сообщения
    const [lastBindStatus, setLastBindStatus] = useState<BindStatusMessage | null>(null);
    const [lastNewReceipts, setLastNewReceipts] = useState<NewReceiptsMessage | null>(null);
    const [lastUnbind, setLastUnbind] = useState<UnbindMessage | null>(null);
    const [lastError, setLastError] = useState<ErrorMessage | null>(null);

    // Рефы для хранения WebSocket и данных
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const callbacksRef = useRef({ onSubscribed, onBindStatus, onNewReceipts, onUnbind, onError, onConnectionChange });

    // Обновляем callbacks при изменении
    useEffect(() => {
        callbacksRef.current = { onSubscribed, onBindStatus, onNewReceipts, onUnbind, onError, onConnectionChange };
    }, [onSubscribed, onBindStatus, onNewReceipts, onUnbind, onError, onConnectionChange]);

    // ============================================================================
    // Обработка сообщений
    // ============================================================================
    const handleMessage = useCallback((data: WebSocketServerMessage) => {
        setMessagesReceived(prev => prev + 1);

        switch (data.type) {
            case 'SUBSCRIBED':
                console.log('✅ Подписка подтверждена');
                callbacksRef.current.onSubscribed?.();
                break;

            case 'BIND_STATUS':
                console.log('📊 Статус подключения:', data.status);
                setLastBindStatus(data);
                callbacksRef.current.onBindStatus?.(data);
                break;

            case 'NEW_RECEIPTS':
                console.log(`📨 Новые чеки: ${data.count} на сумму ${data.totalAmount}₽`);
                setLastNewReceipts(data);
                callbacksRef.current.onNewReceipts?.(data);
                break;

            case 'UNBIND':
                console.log(`❌ Пользователь отключен: ${data.phone}`);
                setLastUnbind(data);
                callbacksRef.current.onUnbind?.(data);
                break;

            case 'ERROR':
                console.error('❌ Ошибка WebSocket:', data.message);
                setLastError(data);
                callbacksRef.current.onError?.(data);
                break;

            default:
                console.warn('⚠️ Неизвестный тип сообщения:', data);
        }
    }, []);

    // ============================================================================
    // Подключение к WebSocket
    // ============================================================================
    const connect = useCallback(() => {
        // Очищаем таймер переподключения
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        // Закрываем существующее соединение
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setStatus('connecting');
        console.log('🔌 Подключение к WebSocket:', url);

        try {
            const ws = new WebSocket(url);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('✅ WebSocket подключен');
                setStatus('connected');
                setReconnectAttempts(0);
                callbacksRef.current.onConnectionChange?.('connected');
            };

            ws.onmessage = (event) => {
                try {
                    const data: WebSocketServerMessage = JSON.parse(event.data);
                    handleMessage(data);
                } catch (error) {
                    console.error('❌ Ошибка парсинга сообщения:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ Ошибка WebSocket:', error);
                setStatus('error');
                callbacksRef.current.onConnectionChange?.('error');
            };

            ws.onclose = (event) => {
                console.log(`⚠️ WebSocket закрыт: ${event.code} ${event.reason}`);
                setStatus('disconnected');
                callbacksRef.current.onConnectionChange?.('disconnected');

                // Попытка переподключения
                if (reconnectAttempts < maxReconnectAttempts) {
                    const nextAttempt = reconnectAttempts + 1;
                    console.log(`🔄 Попытка переподключения ${nextAttempt}/${maxReconnectAttempts}`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        setReconnectAttempts(nextAttempt);
                        connect();
                    }, reconnectDelay);
                } else {
                    console.error('❌ Превышено максимальное количество попыток переподключения');
                }
            };
        } catch (error) {
            console.error('❌ Ошибка создания WebSocket:', error);
            setStatus('error');
            callbacksRef.current.onConnectionChange?.('error');
        }
    }, [url, reconnectAttempts, maxReconnectAttempts, reconnectDelay, handleMessage]);

    // ============================================================================
    // Отписка от WebSocket
    // ============================================================================
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setStatus('disconnected');
        callbacksRef.current.onConnectionChange?.('disconnected');
        console.log('🔌 WebSocket отключен');
    }, []);

    // ============================================================================
    // Переподключение
    // ============================================================================
    const reconnect = useCallback(() => {
        setReconnectAttempts(0);
        connect();
    }, [connect]);

    // ============================================================================
    // Подписка на уведомления
    // ============================================================================
    const subscribe = useCallback((requestId: string, phone: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const message: WebSocketClientMessage = {
                type: 'SUBSCRIBE',
                requestId,
                phone,
            };

            socketRef.current.send(JSON.stringify(message));
            console.log(`📡 Подписка на requestId: ${requestId}, phone: ${phone}`);
        } else {
            console.warn('⚠️ WebSocket не подключен. Подписка не отправлена.');
        }
    }, []);

    // ============================================================================
    // Очистка сообщений
    // ============================================================================
    const clearMessages = useCallback(() => {
        setLastBindStatus(null);
        setLastNewReceipts(null);
        setLastUnbind(null);
        setLastError(null);
        setMessagesReceived(0);
    }, []);

    // ============================================================================
    // Автоматическое подключение при монтировании
    // ============================================================================
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    // ============================================================================
    // Возвращаемое значение
    // ============================================================================
    return {
        // Состояние подключения
        status,
        isConnected: status === 'connected',

        // Последние полученные данные
        lastBindStatus,
        lastNewReceipts,
        lastUnbind,
        lastError,

        // Статистика
        reconnectAttempts,
        messagesReceived,

        // Методы
        subscribe,
        disconnect,
        reconnect,
        clearMessages,
    };
}

/**
 * Получение WebSocket URL в зависимости от окружения
 *
 * Согласно API_DOCUMENTATION.md:
 * - Production: wss://api.xn--24-mlcu7d.xn--p1ai/api/mco/ws
 * - Development: ws://localhost:8080/api/mco/ws (или через переменную NEXT_PUBLIC_WS_URL)
 */
function getWebSocketUrl(): string {
    // Проверяем переменную окружения в первую очередь
    if (process.env.NEXT_PUBLIC_WS_URL) {
        return process.env.NEXT_PUBLIC_WS_URL;
    }

    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
        // Для локальной разработки - прямой URL к бекенду
        return 'ws://localhost:8080/api/mco/ws';
    }

    // Для production - используем тот же хост, что и для API
    // Проверяем наличие window для SSR
    if (typeof window !== 'undefined' && window.location) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}/api/mco/ws`;
    }

    // Fallback для SSR
    return 'wss://api.xn--24-mlcu7d.xn--p1ai/api/mco/ws';
}

export default useMcoWebSocket;
