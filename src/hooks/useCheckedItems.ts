import { useState } from 'react';
import { Receipt } from '@/components/types/interfaces';

export function useCheckedItems() {
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

    function toggleItem(item: Receipt, checked: boolean) {
        setCheckedIds(prev => {
            const next = new Set(prev);
            if (checked) next.add(item.id);
            else next.delete(item.id);
            return next;
        });
    }

    function isChecked(id: number): boolean {
        return checkedIds.has(id);
    }

    return { checkedIds, toggleItem, isChecked, setCheckedIds };
}
