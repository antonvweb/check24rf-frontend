"use client";

import React, { useState } from "react";
import { useMco } from "@/context/McoContext";
import { useUser } from "@/context/UserContext";
import styles from "@/styles/profile/mcoConnection.module.css";

/**
 * Компонент отображения статуса подключения к МЧО и управления подпиской
 *
 * Согласно WEBSOCKET_FRONTEND_GUIDE.md:
 * - Единое WebSocket подключение /ws/notifications для всех уведомлений
 * - Подписка через SUBSCRIBE с requestId и phone
 * - Обработка событий: BIND_STATUS, NEW_RECEIPTS, UNBIND, ERROR
 */
export const McoConnectionPanel: React.FC = () => {
    const {
        wsStatus,
        wsIsConnected,
        wsLastBindStatus,
        wsLastNewReceipts,
        wsLastUnbind,
        wsReconnectAttempts,
        wsSubscribe,
        wsReconnect,
    } = useMco();

    const { currentUser } = useUser();
    const [requestId, setRequestId] = useState<string>("");

    // Получаем номер телефона пользователя
    const phone = currentUser?.phoneNumber || "";

    // Обработчик подписки на уведомления
    const handleSubscribe = () => {
        if (!requestId.trim()) {
            alert("Введите requestId заявки");
            return;
        }

        if (!phone) {
            alert("Номер телефона не найден");
            return;
        }

        wsSubscribe(requestId.trim(), phone);
    };

    // Статус подключения (визуальное отображение)
    const getStatusInfo = () => {
        switch (wsStatus) {
            case 'connected':
                return { label: 'Подключено', className: styles.statusConnected, icon: '✅' };
            case 'connecting':
                return { label: 'Подключение...', className: styles.statusConnecting, icon: '🔄' };
            case 'error':
                return { label: 'Ошибка подключения', className: styles.statusError, icon: '❌' };
            case 'disconnected':
            default:
                return { label: 'Отключено', className: styles.statusDisconnected, icon: '⚠️' };
        }
    };

    const statusInfo = getStatusInfo();

    // Последний статус привязки
    const getBindStatusLabel = (status?: string) => {
        if (!status) return null;

        const labels: Record<string, { text: string; icon: string }> = {
            'REQUEST_APPROVED': { text: 'Заявка одобрена', icon: '✅' },
            'REQUEST_DECLINED': { text: 'Заявка отклонена', icon: '❌' },
            'REQUEST_CANCELLED_AS_DUPLICATE': { text: 'Отменено как дубликат', icon: '⚠️' },
            'REQUEST_EXPIRED': { text: 'Время заявки истекло', icon: '⏰' },
            'REQUEST_IN_PROGRESS': { text: 'Заявка в процессе', icon: '🔄' },
        };

        return labels[status] || { text: status, icon: '📄' };
    };

    return (
        <div className={styles.mcoConnectionPanel}>
            <div className={styles.header}>
                <h3 className={styles.title}>📡 Подключение к МЧО</h3>
                <div className={`${styles.statusBadge} ${statusInfo.className}`}>
                    <span className={styles.statusIcon}>{statusInfo.icon}</span>
                    <span className={styles.statusText}>{statusInfo.label}</span>
                </div>
            </div>

            {/* Информация о подключении */}
            <div className={styles.connectionInfo}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Телефон:</span>
                    <span className={styles.infoValue}>{phone || 'Не указан'}</span>
                </div>

                {wsIsConnected && (
                    <>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Получено сообщений:</span>
                            <span className={styles.infoValue}>{wsReconnectAttempts > 0 ? `Попыток: ${wsReconnectAttempts}` : '—'}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Форма подписки */}
            <div className={styles.subscribeForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="requestId" className={styles.label}>
                        ID заявки (requestId)
                    </label>
                    <input
                        id="requestId"
                        type="text"
                        className={styles.input}
                        placeholder="550e8400-e29b-41d4-a716-446655440000"
                        value={requestId}
                        onChange={(e) => setRequestId(e.target.value)}
                        disabled={!wsIsConnected}
                    />
                </div>

                <button
                    className={styles.subscribeButton}
                    onClick={handleSubscribe}
                    disabled={!wsIsConnected || !requestId.trim() || !phone}
                    title={!wsIsConnected ? 'Сначала подключитесь к WebSocket' : ''}
                >
                    📡 Подписаться на уведомления
                </button>

                {!wsIsConnected && (
                    <button
                        className={styles.reconnectButton}
                        onClick={wsReconnect}
                    >
                        🔄 Переподключиться
                    </button>
                )}
            </div>

            {/* Последние события */}
            <div className={styles.eventsLog}>
                <h4 className={styles.eventsTitle}>📊 Последние события</h4>

                {wsLastBindStatus && (
                    <div className={styles.eventItem}>
                        <span className={styles.eventIcon}>📊</span>
                        <div className={styles.eventContent}>
                            <span className={styles.eventType}>Статус заявки</span>
                            {(() => {
                                const label = getBindStatusLabel(wsLastBindStatus.status);
                                return label ? (
                                    <span className={styles.eventValue}>
                                        {label.icon} {label.text}
                                    </span>
                                ) : null;
                            })()}
                            <span className={styles.eventPhone}>{wsLastBindStatus.phone}</span>
                        </div>
                    </div>
                )}

                {wsLastNewReceipts && (
                    <div className={styles.eventItem}>
                        <span className={styles.eventIcon}>📨</span>
                        <div className={styles.eventContent}>
                            <span className={styles.eventType}>Новые чеки</span>
                            <span className={styles.eventValue}>
                                {wsLastNewReceipts.count} шт. на сумму {wsLastNewReceipts.totalAmount}₽
                            </span>
                            <span className={styles.eventPhone}>{wsLastNewReceipts.phone}</span>
                        </div>
                    </div>
                )}

                {wsLastUnbind && (
                    <div className={styles.eventItem}>
                        <span className={styles.eventIcon}>❌</span>
                        <div className={styles.eventContent}>
                            <span className={styles.eventType}>Отключение</span>
                            <span className={styles.eventValue}>{wsLastUnbind.reason}</span>
                            <span className={styles.eventPhone}>{wsLastUnbind.phone}</span>
                        </div>
                    </div>
                )}

                {!wsLastBindStatus && !wsLastNewReceipts && !wsLastUnbind && (
                    <div className={styles.emptyEvents}>
                        <span>Событий пока нет</span>
                    </div>
                )}
            </div>

            {/* Подсказка */}
            <div className={styles.hint}>
                <p className={styles.hintText}>
                    <strong>Как использовать:</strong>
                </p>
                <ol className={styles.hintList}>
                    <li>Создайте заявку через API или интерфейс</li>
                    <li>Введите полученный requestId в поле выше</li>
                    <li>Нажмите &quot;Подписаться на уведомления&quot;</li>
                    <li>Пользователь должен одобрить заявку на https://dr.stm-labs.ru/</li>
                    <li>После одобрения вы получите уведомление</li>
                </ol>
            </div>
        </div>
    );
};

export default McoConnectionPanel;
