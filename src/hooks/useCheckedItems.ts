import { useState } from 'react';
import { Receipt } from '@/components/types/interfaces';

export function useCheckedItems() {
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [checkedId, setCheckedId] = useState<number | null>(null);

    function toggleChecksItem(item: Receipt, checked: boolean) {
        setCheckedIds(prev => {
            const next = new Set(prev);
            if (checked) next.add(item.id);
            else next.delete(item.id);
            return next;
        });

        // сброс одиночного выбора при множественном
        setCheckedId(null);
    }

    function toggleCheckItem(item: Receipt) {
        setCheckedId(prev => (prev === item.id ? null : item.id));
    }

    function isChecked(id: number): boolean {
        return checkedIds.has(id);
    }

    return { checkedIds, checkedId, toggleChecksItem, toggleCheckItem, isChecked, setCheckedIds };
}
