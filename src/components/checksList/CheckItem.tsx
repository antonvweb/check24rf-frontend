// CheckItem.tsx - финальная версия
import {EmptyState} from "@/components/checksList/EmptyState";
import {ReceiptView} from "@/components/checksList/ReceiptView";
import {MultiListPlaceholder} from "@/components/checksList/MultiListPlaceholder";
import {ReceiptDto} from "@/api/types/typesMcoService";

interface CheckItemDtoProps {
    items: ReceiptDto[];
    item: ReceiptDto | undefined;
    onRemove: (id: number) => void;
    mode?: string;
}

export const CheckItem = ({ items, item, onRemove, mode }: CheckItemDtoProps) => {
    console.log('CheckItem props:', { items, item, itemsLength: items?.length });

    // Если выбрано несколько чеков
    if (items.length > 1) {
        return <MultiListPlaceholder
            items={items}
            onRemove={onRemove}
            mode={mode}
            item={item}
        />;
    }

    if (items.length === 1) {
        return <ReceiptView
            receipt={items[0]} // Берем из items, а не из item
            onRemove={onRemove}
            mode={mode}
        />;
    }

    // Если ничего не выбрано
    return <EmptyState />;
};