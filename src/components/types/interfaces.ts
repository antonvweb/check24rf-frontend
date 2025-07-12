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
    onRemove: (id: number) => void;
    mode?: string;
}