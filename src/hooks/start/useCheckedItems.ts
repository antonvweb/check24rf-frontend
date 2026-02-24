// useCheckedItems.ts
import {useCallback, useState} from 'react';
import { ReceiptDto } from "@/api/types/typesMcoService";
import { generateReceiptId } from "@/api/types/typesMcoService";

export function useCheckedItems() {
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [checkedItems, setCheckedItems] = useState<ReceiptDto[]>([]);

    const toggleChecksItem = useCallback((item: ReceiptDto) => {
        setCheckedIds(prev => {
            const itemId = item.id ?? generateReceiptId();
            const next = new Set(prev);

            if (next.has(itemId)) {
                next.delete(itemId);
                setCheckedItems(prevItems =>
                    prevItems.filter(i => (i.id ?? generateReceiptId()) !== itemId)
                );
            } else {
                next.add(itemId);
                setCheckedItems(prevItems => {
                    const itemExists = prevItems.some(i =>
                        (i.id ?? generateReceiptId()) === itemId
                    );
                    if (itemExists) {
                        return prevItems;
                    }
                    return [...prevItems, item];
                });
            }
            return next;
        });
    }, []);

    const isChecked = useCallback((item: ReceiptDto): boolean => {
        const itemId = item.id ?? generateReceiptId();
        return checkedIds.has(itemId);
    }, [checkedIds]);

    const clearCheckedItems = useCallback(() => {
        setCheckedIds(new Set());
        setCheckedItems([]);
    }, []);

    return {
        checkedIds,
        checkedItems,
        toggleChecksItem,
        isChecked,
        clearCheckedItems
    };
}
