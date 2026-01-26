// useCheckedItems.ts
import {useCallback, useState} from 'react';
import { ReceiptDto } from "@/api/types/typesMcoService";
import { generateReceiptId } from "@/api/types/typesMcoService";

export function useCheckedItems() {
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [checkedItems, setCheckedItems] = useState<ReceiptDto[]>([]);

    const toggleChecksItem = useCallback((item: ReceiptDto) => {
        console.log('toggleChecksItem called with item:', item);

        setCheckedIds(prev => {
            const itemId = item.id || generateReceiptId();
            console.log('Processing toggle for ID:', itemId, 'Current checkedIds:', Array.from(prev));

            const next = new Set(prev);
            if (next.has(itemId)) {
                console.log('Removing item:', itemId);
                next.delete(itemId);
                setCheckedItems(prevItems => {
                    const newItems = prevItems.filter(i => {
                        const iId = i.id || generateReceiptId();
                        return iId !== itemId;
                    });
                    console.log('New checkedItems after removal:', newItems);
                    return newItems;
                });
            } else {
                console.log('Adding item:', itemId);
                next.add(itemId);

                // Проверяем, существует ли элемент перед добавлением
                setCheckedItems(prevItems => {
                    const itemExists = prevItems.some(i => {
                        const iId = i.id || generateReceiptId();
                        return iId === itemId;
                    });

                    if (itemExists) {
                        console.log('Item already exists, skipping addition');
                        return prevItems;
                    }

                    const newItems = [...prevItems, item];
                    console.log('New checkedItems after addition:', newItems);
                    return newItems;
                });
            }
            return next;
        });
    }, []);

    const isChecked = useCallback((item: ReceiptDto): boolean => {
        const itemId = item.id || generateReceiptId();
        const checked = checkedIds.has(itemId);
        console.log(`isChecked for ID ${itemId}:`, checked);
        return checked;
    }, [checkedIds]);

    function clearCheckedItems() {
        console.log('Clearing all checked items');
        setCheckedIds(new Set());
        setCheckedItems([]);
    }

    return {
        checkedIds,
        checkedItems,
        toggleChecksItem,
        isChecked,
        clearCheckedItems
    };
}