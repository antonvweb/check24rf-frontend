/**
 * Константы для MCO API
 * 
 * Использование:
 * import { MCO_PERMISSION_GROUPS, MCO_MARKERS } from '@/api/constants/mco';
 */

/**
 * Группы разрешений для привязки пользователей
 */
export const MCO_PERMISSION_GROUPS = {
    /** Группа по умолчанию */
    DEFAULT: 'DEFAULT',
    /** Администраторы */
    ADMIN: 'ADMIN',
    /** Менеджеры */
    MANAGER: 'MANAGER',
    /** Операторы */
    OPERATOR: 'OPERATOR',
    /** Только чтение */
    READ_ONLY: 'READ_ONLY',
} as const;

export type McoPermissionGroup = typeof MCO_PERMISSION_GROUPS[keyof typeof MCO_PERMISSION_GROUPS];

/**
 * Маркеры для пагинации
 */
export const MCO_MARKERS = {
    /** Начать с начала */
    START: 'S_FROM_START',
    /** Начать с конца */
    FROM_END: 'S_FROM_END',
    /** Следующая страница */
    NEXT: 'NEXT',
    /** Предыдущая страница */
    PREV: 'PREV',
} as const;

export type McoMarker = typeof MCO_MARKERS[keyof typeof MCO_MARKERS];

/**
 * Статусы привязки пользователя
 */
export const MCO_BIND_STATUS = {
    /** Ожидает обработки */
    PENDING: 'PENDING',
    /** В процессе */
    PROCESSING: 'PROCESSING',
    /** Успешно */
    SUCCESS: 'SUCCESS',
    /** Ошибка */
    FAILED: 'FAILED',
    /** Отменено */
    CANCELLED: 'CANCELLED',
} as const;

export type McoBindStatus = typeof MCO_BIND_STATUS[keyof typeof MCO_BIND_STATUS];

/**
 * Категории уведомлений
 */
export const MCO_NOTIFICATION_CATEGORIES = {
    /** Общее */
    GENERAL: 'GENERAL',
    /** Промо */
    PROMO: 'PROMO',
    /** Системное */
    SYSTEM: 'SYSTEM',
    /** Важное */
    IMPORTANT: 'IMPORTANT',
} as const;

export type McoNotificationCategory = typeof MCO_NOTIFICATION_CATEGORIES[keyof typeof MCO_NOTIFICATION_CATEGORIES];

/**
 * Типы операций в чеках
 */
export const MCO_OPERATION_TYPES = {
    /** Приход */
    INCOME: 1,
    /** Расход */
    OUTCOME: 2,
    /** Возврат прихода */
    INCOME_RETURN: 3,
    /** Возврат расхода */
    OUTCOME_RETURN: 4,
} as const;

export type McoOperationType = typeof MCO_OPERATION_TYPES[keyof typeof MCO_OPERATION_TYPES];

/**
 * Типы налогообложения
 */
export const MCO_TAXATION_TYPES = {
    /** Общая система */
    OSN: 1,
    /** УСН доходы */
    USN_INCOME: 2,
    /** УСН доходы-расходы */
    USN_INCOME_OUTCOME: 3,
    /** ЕНВД */
    ENV: 4,
    /** ЕСХН */
    ESKHN: 5,
    /** Патент */
    PSN: 6,
} as const;

export type McoTaxationType = typeof MCO_TAXATION_TYPES[keyof typeof MCO_TAXATION_TYPES];

/**
 * Расшифровка типов налогообложения
 */
export const MCO_TAXATION_LABELS: Record<number, string> = {
    1: 'ОСН',
    2: 'УСН (доход)',
    3: 'УСН (доход-расход)',
    4: 'ЕНВД',
    5: 'ЕСХН',
    6: 'ПСН',
};

/**
 * Лимиты API
 */
export const MCO_LIMITS = {
    /** Максимум номеров в пакетном запросе */
    BATCH_BIND_MAX: 100,
    /** Максимум requestId в запросе статусов */
    STATUSES_MAX: 50,
    /** Максимальный размер страницы */
    MAX_PAGE_SIZE: 100,
    /** Размер страницы по умолчанию */
    DEFAULT_PAGE_SIZE: 20,
} as const;

/**
 * Endpoints MCO API
 */
export const MCO_ENDPOINTS = {
    BIND_USER: '/api/mco/bind-user',
    BIND_USERS_BATCH: '/api/mco/bind-users-batch',
    BIND_REQUEST_STATUS: '/api/mco/bind-request-status',
    BIND_REQUESTS_STATUSES: '/api/mco/bind-requests-statuses',
    BIND_EVENTS: '/api/mco/bind-events',
    UNBOUND_USERS: '/api/mco/unbound-users',
    UNBIND_USER: '/api/mco/unbind-user',
    RECEIPTS_SYNC: '/api/mco/receipts/sync',
    RECEIPTS_USER: '/api/mco/receipts/user',
    RECEIPTS_STATS: '/api/mco/receipts/stats',
    SEND_NOTIFICATION: '/api/mco/send-notification',
    HEALTH: '/api/mco/health',
} as const;
