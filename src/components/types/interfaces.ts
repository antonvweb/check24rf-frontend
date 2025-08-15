export interface SalesRow {
    id: number;
    saleId: number;
    title: string;
    qty: number;
    sum: number;
}

export interface Receipt {
    id: number;
    logo: string;
    date: string;
    salesman: string;
    ooo: string;
    buyer: string;
    inn: number;
    price: number;
    rows: SalesRow[];
}

export interface CheckItemProps {
    items: Receipt[];
    item: Receipt | undefined;
    onRemove: (id: number) => void;
    mode?: string;
}

export interface User {
    phoneNumber: string;
    phoneNumberAlt: string;
    email: string;
    emailAlt: string;
    telegramChatId: string;
    createdAt: string;
    isActive: boolean;
}

export interface userPaySubscribe {
    userToken: string;
    monthPeriod: string | null;
}