// typesMcoService.ts

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string; // ISO string
}

export type BindUserData = {
    requestId: string;
    userIdentifier: string;
    permissionGroups: string;
    statusCheckUrl: string;
    userInstruction: string;
};

export interface BindRequestStatus {
    requestId: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
    errorMessage?: string | null;
}

// receipt-page.interface.ts

/**
 * Полная структура ответа пагинированного списка чеков
 */
export interface ReceiptPageResponse {
    totalElements: number;
    totalPages: number;
    pageable: Pageable;
    first: boolean;
    last: boolean;
    size: number;
    content: ReceiptDto[];
    number: number;
    sort: SortInfo;
    numberOfElements: number;
    empty: boolean;
}

/**
 * Информация о текущей странице и сортировке
 */
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: SortInfo;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

/**
 * Информация о сортировке
 */
export interface SortInfo {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
}

/**
 * Один чек (то, что приходит в content)
 */
export interface ReceiptDto {
    id?: number;
    phone: string;
    email: string | null;
    fiscalSign: number;
    fiscalDocumentNumber: number;
    fiscalDriveNumber: string;
    receiptDateTime: string;      // ISO-строка, например "2026-01-20T08:48:37"
    receiveDate: string;          // ISO-строка
    totalSum: number;             // уже в рублях с двумя знаками
    sourceCode: string;
    operationType: number;
    userInn: string;
    retailPlace: string;
    rawJson: RawReceiptJson;      // полный распарсенный JSON чека
}

export function generateReceiptId(receipt: Omit<ReceiptDto, 'id'>): number {
    // Используем уникальные поля для создания стабильного ID
    const str = `${receipt.fiscalSign}_${receipt.fiscalDocumentNumber}_${receipt.fiscalDriveNumber}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Хелпер для добавления ID к массиву чеков
export function addIdsToReceipts(receipts: Omit<ReceiptDto, 'id'>[]): ReceiptDto[] {
    return receipts.map(receipt => ({
        ...receipt,
        id: generateReceiptId(receipt)
    }));
}

/**
 * Структура rawJson внутри каждого чека
 */
export interface RawReceiptJson {
    user: string;
    items: ReceiptItem[];
    nds10: number;
    nds18?: number;               // может отсутствовать
    nds20?: number;
    fnsSite: string;
    userInn: string;
    dateTime: number;             // unix timestamp в секундах
    kktRegId: string;
    operator: string;
    totalSum: number;             // в копейках!
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
    retailPlaceAddress?: string;  // может отсутствовать
    fiscalDocumentNumber: number;
    fiscalDocumentFormatVer: number;
}

/**
 * Один товар в чеке (items)
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

export interface BindEvent {
    requestId: string;
    phoneNumber: string;
    status: string;
    timestamp: string;
    error?: string;
}

export interface BindEventsPage {
    events: BindEvent[];
    nextMarker: string | null;
}

export interface UnboundUser {
    phoneNumber: string;
    unboundAt: string;
}

export interface UnboundUsersPage {
    users: UnboundUser[];
    nextMarker: string | null;
}

export interface ReceiptsPage {
    receipts: Receipt[];
    nextMarker: string | null;
}

export interface ReceiptsStats {
    totalCount: number;
    uniqueUsersCount: number;
    lastSyncTime?: string;
    // другие поля по необходимости
}

export interface SendNotificationPayload {
    phoneNumber: string;
    title: string;
    message: string;
    shortMessage?: string;
    category: 'GENERAL' | 'PROMO' | 'SYSTEM' | 'IMPORTANT' | string;
    externalItemId?: string;
    externalItemUrl?: string;
}

export type SendNotificationData = {
    notificationId?: string;
    status: string;
};

// typeMcoService.ts (дополнить / создать)

export interface BindEvent {
    events: BindEventData[];
    nextMarker: string;
    eventsCount: number;
}

interface BindEventData {
    requestId: string;
    result: string;
    userIdentifier: string;
    responseTime: string;
}

export interface UnboundUser {
    unboundUsers: UnboundUserData[];
    unboundAt: string;
    reason?: string;
}

interface UnboundUserData{
    requestId: string;
    userIdentifier: string;
    responseTime: string;
}

export interface UnbindUserRequest {
    phoneNumber: string;
    unbindReason: string;
}


export interface Receipt {
    id: string;
    userId: string;
    userIdentifier: string;
    phone: string;
    email: string;
    fiscalSign: number;
    fiscalDocumentNumber: number;
    fiscalDriveNumber: string;
    receiptDateTime: string;
    LocalDateTime: string;
    totalSum: number;
    sourceCode: string;
    operationType: number;
    userInn: string;
    retailPlace: string;
    rawJson: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserReceipts {
    success: string;
    message: string;
    data: Receipt[];
}

export interface ReceiptsStats {
    success: string;
    message: string;
    data: Receipt[];
}