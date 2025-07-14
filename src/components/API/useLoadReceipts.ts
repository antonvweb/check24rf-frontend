import { useState, useCallback } from 'react';
import { Receipt } from '@/components/types/interfaces';

interface UseLoadReceiptsParams {
    endpoint: string;
    mode: string;

}

export function useLoadReceipts({ endpoint, mode }: UseLoadReceiptsParams) {
    const [items, setItems] = useState<Receipt[]>([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 30;
    const [sortKey, setSortKey] = useState<string>("date");
    const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");

    const loadItems = useCallback(async (reset: boolean) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const currentOffset = reset ? 0 : offset;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    mode,
                    offset: currentOffset,
                    limit,
                    sortBy: sortKey,
                    orderDir
                }),
            });

            if (!res.ok) {
                throw new Error(`Ошибка ${res.status} ${res.statusText}`);
            }

            const data: Receipt[] = await res.json();

            // Форматирование даты
            const formatter = new Intl.DateTimeFormat("ru-RU", {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Moscow',
            });

            data.forEach(item => {
                const rawDate = new Date(item.date);
                item.date = formatter.format(rawDate);
            });

            if (reset) {
                setItems(data);
                setOffset(data.length);
            } else {
                setItems(prev => {
                    const existingIds = new Set(prev.map(i => i.id));
                    const newUnique = data.filter(i => !existingIds.has(i.id));
                    return [...prev, ...newUnique];
                });
                setOffset(prev => prev + data.length);
            }

            setHasMore(data.length === limit);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, offset, endpoint, mode, sortKey, orderDir, limit]);

    return { items, loadItems, hasMore, isLoading, setItems, setOffset, sortKey, orderDir, setSortKey, setOrderDir };
}
