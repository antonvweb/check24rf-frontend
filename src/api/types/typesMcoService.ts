// typesMcoService.ts
// Типы согласно API_DOCUMENTATION.md

// ============================================================================
// Общие типы ответов API
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T | null;
    timestamp?: string; // ISO 8601
}

// ============================================================================
// User Binding (Подключение пользователя)
// ============================================================================

/**
 * Данные подключения пользователя
 * POST /api/mco/bind-user response data
 */
export interface BindUserData {
    requestId: string;
    userIdentifier: string;
    permissionGroups: string;
    statusCheckUrl: string;
    userInstruction: string;
}

/**
 * Статус заявки на подключение
 * GET /api/mco/bind-request-status response data
 */
export interface BindRequestStatus {
    requestId: string;
    status: BindStatusType;
    statusDescription?: string;
    userIdentifier: string;
    permissionGroups: string;
    responseTime?: string; // ISO 8601
    rejectionReason?: string | null;
}

export type BindStatusType =
    | 'IN_PROGRESS'
    | 'REQUEST_APPROVED'
    | 'REQUEST_DECLINED'
    | 'REQUEST_EXPIRED'
    | 'REQUEST_CANCELLED_AS_DUPLICATE';

/**
 * Пакетный запрос на подключение
 * POST /api/mco/bind-users-batch response data
 */
export interface BatchBindResult {
    requestId?: string;
    acceptedCount: number;
    rejectedCount: number;
    acceptedUsers: string[];
    rejectedUsers: RejectedUser[];
}

export interface RejectedUser {
    userIdentifier: string;
    rejectionReasonCode: string;
    rejectionReasonMessage: string;
}

// ============================================================================
// Bind Events & Unbind
// ============================================================================

/**
 * Событие подключения
 * GET /api/mco/bind-events response data
 */
export interface BindEventsResponse {
    events: BindEventItem[];
    nextMarker?: string | null;
    eventsCount: number;
}

export interface BindEventItem {
    requestId: string;
    result: BindStatusType;
    userIdentifier: string;
    responseTime: string; // ISO 8601
}

/**
 * Отключенный пользователь
 * GET /api/mco/unbound-users response data
 */
export interface UnboundUsersResponse {
    unboundUsers: UnboundUserItem[];
    nextMarker?: string | null;
    hasMore?: boolean;
    count: number;
}

export interface UnboundUserItem {
    requestId: string;
    userIdentifier: string;
    responseTime: string; // ISO 8601
}

/**
 * Запрос на отключение пользователя
 * POST /api/mco/unbind-user request
 */
export interface UnbindUserRequest {
    phoneNumber: string;
    unbindReason: string;
}

/**
 * Ответ на отключение пользователя
 * POST /api/mco/unbind-user response data
 */
export interface UnbindUserResponse {
    phoneNumber: string;
    status: 'UNBOUND' | 'ALREADY_UNBOUND';
    unboundAt: string; // ISO 8601
    message: string;
}

// ============================================================================
// Receipts (Чеки)
// ============================================================================

/**
 * Чек из МЧО
 * GET /api/mco/receipts/user response data.content
 */
export interface ReceiptDto {
    id?: number;                  // локальный ID для UI
    phone?: string;
    email?: string | null;
    fiscalSign: number;
    fiscalDocumentNumber: number;
    fiscalDriveNumber: string;
    receiptDateTime: string;      // ISO 8601
    receiveDate: string;          // ISO 8601
    totalSum: number;             // в рублях
    sourceCode: string;
    operationType?: number;
    userInn?: string;
    retailPlace?: string;
    rawJson: RawReceiptJson;      // всегда объект (требуется на бэкенде)
}

/**
 * Структура rawJson внутри чека
 */
export interface RawReceiptJson {
    user: string;
    items: ReceiptItem[];
    nds10: number;
    nds18?: number;
    nds20?: number;
    fnsSite: string;
    userInn: string;
    dateTime: number;             // unix timestamp в секундах
    kktRegId: string;
    operator: string;
    totalSum: number;             // в копейках
    creditSum: number;
    fiscalSign: number;
    prepaidSum: number;
    receiptCode: number;
    retailPlace: string;
    shiftNumber: number;
    buyerAddress: string;
    cashTotalSum: number;
    internetSign: number;
    provisionSum: number;
    taxationType: number;
    ecashTotalSum: number;
    machineNumber: string;
    operationType: number;
    requestNumber: number;
    paymentAgentType: number;
    fiscalDriveNumber: string;
    messageFiscalSign: number;
    retailPlaceAddress?: string;
    fiscalDocumentNumber: number;
    fiscalDocumentFormatVer: number;
}

/**
 * Один товар в чеке
 */
export interface ReceiptItem {
    nds?: number;
    sum: number;                  // в копейках
    name: string;
    price: number;                // в копейках
    quantity: number;
    paymentType?: number;
    productType?: number;
    providerInn?: string;
}

/**
 * Пагинированный ответ с чеками
 * GET /api/mco/receipts/user response data
 */
export interface ReceiptPageResponse {
    content: ReceiptDto[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: SortInfo;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    size: number;
    number: number;
    sort: SortInfo;
    numberOfElements: number;
    empty: boolean;
}

export interface SortInfo {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
}

/**
 * Статистика по чекам
 * GET /api/mco/receipts/stats response data
 */
export interface ReceiptsStats {
    totalCount: number;
    uniqueUsersCount?: number;
    lastSyncTime?: string; // ISO 8601
}

// ============================================================================
// Notifications (Уведомления)
// ============================================================================

/**
 * Запрос на отправку уведомления
 * POST /api/mco/send-notification request
 */
export interface SendNotificationPayload {
    phoneNumber: string;
    title: string;
    message: string;
    shortMessage?: string;
    category?: 'GENERAL' | 'PROMO' | 'SYSTEM' | 'IMPORTANT' | string;
    externalItemId?: string;
    externalItemUrl?: string;
}

/**
 * Ответ на отправку уведомления
 * POST /api/mco/send-notification response data
 */
export interface SendNotificationData {
    requestId?: string;
    handledAt?: string; // ISO 8601
    phoneNumber: string;
}

// ============================================================================
// WebSocket типы согласно WEBSOCKET_FRONTEND_GUIDE.md и API_DOCUMENTATION.md
// ============================================================================

export type WebSocketMessageType =
    | 'SUBSCRIBED'
    | 'BIND_STATUS'
    | 'NEW_RECEIPTS'
    | 'UNBIND'
    | 'ERROR';

export type WebSocketBindStatusType =
    | 'REQUEST_APPROVED'
    | 'REQUEST_DECLINED'
    | 'REQUEST_CANCELLED_AS_DUPLICATE'
    | 'REQUEST_EXPIRED'
    | 'REQUEST_IN_PROGRESS';

export type WebSocketConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Сообщения от сервера к клиенту
export interface WebSocketMessage {
    type: WebSocketMessageType;
}

export interface SubscribedMessage extends WebSocketMessage {
    type: 'SUBSCRIBED';
    status: 'success';
}

export interface BindStatusMessage extends WebSocketMessage {
    type: 'BIND_STATUS';
    requestId: string;
    status: WebSocketBindStatusType;
    phone: string;
}

export interface NewReceiptsMessage extends WebSocketMessage {
    type: 'NEW_RECEIPTS';
    phone: string;
    count: number;
    totalAmount: string;
}

export interface UnbindMessage extends WebSocketMessage {
    type: 'UNBIND';
    phone: string;
    reason: string;
    timestamp: string; // ISO 8601
}

export interface ErrorMessage extends WebSocketMessage {
    type: 'ERROR';
    requestId?: string;
    message: string;
}

export type WebSocketServerMessage =
    | SubscribedMessage
    | BindStatusMessage
    | NewReceiptsMessage
    | UnbindMessage
    | ErrorMessage;

// Сообщение от клиента к серверу
export interface WebSocketSubscribeMessage {
    type: 'SUBSCRIBE';
    requestId: string;
    phone: string;
}

export type WebSocketClientMessage = WebSocketSubscribeMessage;

// ============================================================================
// Callback типы для WebSocket хука
// ============================================================================

export interface WebSocketCallbacks {
    onSubscribed?: () => void;
    onBindStatus?: (data: BindStatusMessage) => void;
    onNewReceipts?: (data: NewReceiptsMessage) => void;
    onUnbind?: (data: UnbindMessage) => void;
    onError?: (data: ErrorMessage) => void;
    onConnectionChange?: (status: WebSocketConnectionStatus) => void;
}

// ============================================================================
// Projects (Проекты)
// ============================================================================

export interface Project {
    id: string;
    name: string;
    createdAt: string; // ISO 8601
    receiptIds: number[];
}

// ============================================================================
// Mock данные (fallback когда бекенд недоступен)
// ============================================================================

export const MOCK_RECEIPTS: ReceiptDto[] = [
    {
        id: 1001,
        fiscalSign: 1111111111,
        fiscalDocumentNumber: 12345,
        fiscalDriveNumber: '9999078900012345',
        receiptDateTime: '2026-01-12T15:32:00',
        receiveDate: '2026-01-12T15:32:00',
        totalSum: 459.00,
        sourceCode: 'MOCK',
        operationType: 1,
        userInn: '7707083893',
        rawJson: {
            user: 'ООО «Пятёрочка»',
            items: [
                { name: 'Хлеб Бородинский', price: 4900, quantity: 1, sum: 4900 },
                { name: 'Молоко 2.5%', price: 6500, quantity: 1, sum: 6500 },
                { name: 'Сыр Российский', price: 34500, quantity: 1, sum: 34500 },
            ],
            nds10: 4182,
            fnsSite: '',
            userInn: '7707083893',
            dateTime: 1736695920,
            kktRegId: '',
            operator: '',
            totalSum: 45900,
            creditSum: 0,
            fiscalSign: 1111111111,
            prepaidSum: 0,
            receiptCode: 0,
            retailPlace: 'Пятёрочка',
            shiftNumber: 0,
            buyerAddress: '79054455906',
            cashTotalSum: 45900,
            internetSign: 0,
            provisionSum: 0,
            taxationType: 0,
            ecashTotalSum: 0,
            machineNumber: '',
            operationType: 1,
            requestNumber: 0,
            paymentAgentType: 0,
            fiscalDriveNumber: '9999078900012345',
            messageFiscalSign: 0,
            retailPlaceAddress: 'г. Москва, ул. Ленина, д. 12',
            fiscalDocumentNumber: 12345,
            fiscalDocumentFormatVer: 0,
        },
    },
    {
        id: 1002,
        fiscalSign: 2222222222,
        fiscalDocumentNumber: 67890,
        fiscalDriveNumber: '9999078900012346',
        receiptDateTime: '2026-01-13T10:15:00',
        receiveDate: '2026-01-13T10:15:00',
        totalSum: 823.00,
        sourceCode: 'MOCK',
        operationType: 1,
        userInn: '7701003620',
        rawJson: {
            user: 'ООО «Магнит»',
            items: [
                { name: 'Кофе Jacobs 95г', price: 47500, quantity: 1, sum: 47500 },
                { name: 'Сахар 1 кг', price: 34800, quantity: 1, sum: 34800 },
            ],
            nds10: 0,
            nds20: 13717,
            fnsSite: '',
            userInn: '7701003620',
            dateTime: 1736763300,
            kktRegId: '',
            operator: '',
            totalSum: 82300,
            creditSum: 0,
            fiscalSign: 2222222222,
            prepaidSum: 0,
            receiptCode: 0,
            retailPlace: 'Магнит',
            shiftNumber: 0,
            buyerAddress: '79054455906',
            cashTotalSum: 82300,
            internetSign: 0,
            provisionSum: 0,
            taxationType: 0,
            ecashTotalSum: 0,
            machineNumber: '',
            operationType: 1,
            requestNumber: 0,
            paymentAgentType: 0,
            fiscalDriveNumber: '9999078900012346',
            messageFiscalSign: 0,
            retailPlaceAddress: 'г. Санкт-Петербург, пр. Невский, д. 55',
            fiscalDocumentNumber: 67890,
            fiscalDocumentFormatVer: 0,
        },
    },
    {
        id: 1003,
        fiscalSign: 3333333333,
        fiscalDocumentNumber: 77777,
        fiscalDriveNumber: '9999078900012347',
        receiptDateTime: '2026-01-14T18:47:00',
        receiveDate: '2026-01-14T18:47:00',
        totalSum: 1275.00,
        sourceCode: 'MOCK',
        operationType: 1,
        userInn: '7725301000',
        rawJson: {
            user: 'ООО «ВкусВилл»',
            items: [
                { name: 'Яйца куриные 10 шт', price: 8900, quantity: 1, sum: 8900 },
                { name: 'Кефир 1%', price: 6700, quantity: 1, sum: 6700 },
                { name: 'Филе куриное', price: 111000, quantity: 1, sum: 111000 },
            ],
            nds10: 11591,
            fnsSite: '',
            userInn: '7725301000',
            dateTime: 1736880420,
            kktRegId: '',
            operator: '',
            totalSum: 127500,
            creditSum: 0,
            fiscalSign: 3333333333,
            prepaidSum: 0,
            receiptCode: 0,
            retailPlace: 'ВкусВилл',
            shiftNumber: 0,
            buyerAddress: '79054455906',
            cashTotalSum: 127500,
            internetSign: 0,
            provisionSum: 0,
            taxationType: 0,
            ecashTotalSum: 0,
            machineNumber: '',
            operationType: 1,
            requestNumber: 0,
            paymentAgentType: 0,
            fiscalDriveNumber: '9999078900012347',
            messageFiscalSign: 0,
            retailPlaceAddress: 'г. Екатеринбург, ул. Мира, д. 4',
            fiscalDocumentNumber: 77777,
            fiscalDocumentFormatVer: 0,
        },
    },
    {
        id: 1004,
        fiscalSign: 4444444444,
        fiscalDocumentNumber: 88888,
        fiscalDriveNumber: '9999078900012348',
        receiptDateTime: '2026-01-15T14:12:00',
        receiveDate: '2026-01-15T14:12:00',
        totalSum: 1250.00,
        sourceCode: 'MOCK',
        operationType: 1,
        userInn: '7709476049',
        rawJson: {
            user: 'ООО «Додо Пицца»',
            items: [
                { name: 'Пицца Маргарита 30 см', price: 95000, quantity: 1, sum: 95000 },
                { name: 'Кола 0.5л', price: 30000, quantity: 1, sum: 30000 },
            ],
            nds10: 0,
            nds20: 20833,
            fnsSite: '',
            userInn: '7709476049',
            dateTime: 1736950320,
            kktRegId: '',
            operator: '',
            totalSum: 125000,
            creditSum: 0,
            fiscalSign: 4444444444,
            prepaidSum: 0,
            receiptCode: 0,
            retailPlace: 'Додо Пицца',
            shiftNumber: 0,
            buyerAddress: '79054455906',
            cashTotalSum: 125000,
            internetSign: 0,
            provisionSum: 0,
            taxationType: 0,
            ecashTotalSum: 0,
            machineNumber: '',
            operationType: 1,
            requestNumber: 0,
            paymentAgentType: 0,
            fiscalDriveNumber: '9999078900012348',
            messageFiscalSign: 0,
            retailPlaceAddress: 'г. Казань, ул. Баумана, д. 44',
            fiscalDocumentNumber: 88888,
            fiscalDocumentFormatVer: 0,
        },
    },
    {
        id: 1005,
        fiscalSign: 5555555555,
        fiscalDocumentNumber: 99999,
        fiscalDriveNumber: '9999078900012349',
        receiptDateTime: '2026-01-16T10:03:00',
        receiveDate: '2026-01-16T10:03:00',
        totalSum: 2399.00,
        sourceCode: 'MOCK',
        operationType: 1,
        userInn: '7814145001',
        rawJson: {
            user: 'ООО «Лента»',
            items: [
                { name: 'Масло подсолнечное', price: 13500, quantity: 1, sum: 13500 },
                { name: 'Макароны Barilla', price: 7900, quantity: 2, sum: 15800 },
                { name: 'Курица охлажденная', price: 211600, quantity: 1, sum: 211600 },
            ],
            nds10: 21809,
            fnsSite: '',
            userInn: '7814145001',
            dateTime: 1737021780,
            kktRegId: '',
            operator: '',
            totalSum: 239900,
            creditSum: 0,
            fiscalSign: 5555555555,
            prepaidSum: 0,
            receiptCode: 0,
            retailPlace: 'Лента',
            shiftNumber: 0,
            buyerAddress: '79054455906',
            cashTotalSum: 239900,
            internetSign: 0,
            provisionSum: 0,
            taxationType: 0,
            ecashTotalSum: 0,
            machineNumber: '',
            operationType: 1,
            requestNumber: 0,
            paymentAgentType: 0,
            fiscalDriveNumber: '9999078900012349',
            messageFiscalSign: 0,
            retailPlaceAddress: 'г. Новосибирск, ул. Сибирская, д. 8',
            fiscalDocumentNumber: 99999,
            fiscalDocumentFormatVer: 0,
        },
    },
];

// ============================================================================
// Helper функции
// ============================================================================

let currentId = 0;

export function generateReceiptId(): number {
    return currentId++;
}

export function addIdsToReceipts(receipts: Omit<ReceiptDto, 'id'>[]): ReceiptDto[] {
    return receipts.map(receipt => ({
        ...receipt,
        id: currentId++
    }));
}
