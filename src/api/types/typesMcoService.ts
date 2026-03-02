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
