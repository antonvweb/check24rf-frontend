// components/CheckItem.tsx
import {CheckItemProps} from "@/components/types/interfaces";
import {EmptyState} from "@/components/checksList/EmptyState";
import {ReceiptView} from "@/components/checksList/ReceiptView";
import {MultiListPlaceholder} from "@/components/checksList/MultiListPlaceholder";

export const CheckItem = ({ items, onRemove, mode }: CheckItemProps) => {
    if (items.length === 0) return <EmptyState />;

    if (items.length === 1) return <ReceiptView receipt={items[0]} onRemove={onRemove} mode={mode} />;

    return <MultiListPlaceholder items={items} onRemove={onRemove} mode={mode} />;
};
