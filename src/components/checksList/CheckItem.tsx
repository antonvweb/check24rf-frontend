// components/CheckItem.tsx
import {CheckItemProps} from "@/components/types/interfaces";
import {EmptyState} from "@/components/checksList/EmptyState";
import {ReceiptView} from "@/components/checksList/ReceiptView";
import {MultiListPlaceholder} from "@/components/checksList/MultiListPlaceholder";

export const CheckItem = ({ items, item, onRemove, mode }: CheckItemProps) => {
    if (items?.length !== 0) return <MultiListPlaceholder items={items} onRemove={onRemove} mode={mode} item={item} />;

    if (item !== null && item !== undefined && items?.length === 0) {
        console.log(item)
        return <ReceiptView receipt={item} onRemove={onRemove} mode={mode} />;
    }

    return <EmptyState />;
};
