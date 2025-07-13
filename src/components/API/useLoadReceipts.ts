import { useState, useCallback } from 'react';
import { Receipt } from '@/components/types/interfaces';

interface UseLoadReceiptsParams {
    endpoint: string;
    mode: string;

}

const checks: Receipt[] = [
    {
        id: 1,
        logo: "",
        date: "12.12.24",
        salesman: "Яндекс",
        ooo: "ООО Яндекс",
        buyer: "1231241",
        inn: 7700000001,
        price: 1000,
        rows: [
            { id: 1, saleId: 1, title: "Товар A", qty: 2, sum: 500 },
            { id: 2, saleId: 1, title: "Товар B", qty: 1, sum: 500 }
        ]
    },
    {
        id: 2,
        logo: "",
        date: "13.12.24",
        salesman: "Сбер",
        ooo: "ООО Сбер",
        buyer: "2231242",
        inn: 7700000002,
        price: 1500,
        rows: [
            { id: 3, saleId: 2, title: "Товар C", qty: 3, sum: 900 },
            { id: 4, saleId: 2, title: "Товар D", qty: 2, sum: 600 }
        ]
    },
    {
        id: 3,
        logo: "",
        date: "14.12.24",
        salesman: "МТС",
        ooo: "ООО МТС",
        buyer: "3231243",
        inn: 7700000003,
        price: 800,
        rows: [
            { id: 5, saleId: 3, title: "Товар E", qty: 4, sum: 800 }
        ]
    },
    {
        id: 4,
        logo: "",
        date: "15.12.24",
        salesman: "OZON",
        ooo: "ООО Озон",
        buyer: "4231244",
        inn: 7700000004,
        price: 1200,
        rows: [
            { id: 6, saleId: 4, title: "Товар F", qty: 2, sum: 600 },
            { id: 7, saleId: 4, title: "Товар G", qty: 3, sum: 600 }
        ]
    },
    {
        id: 5,
        logo: "",
        date: "16.12.24",
        salesman: "Wildberries",
        ooo: "ООО Вайлдберриз",
        buyer: "5231245",
        inn: 7700000005,
        price: 950,
        rows: [
            { id: 8, saleId: 5, title: "Товар H", qty: 5, sum: 950 }
        ]
    },
    {
        id: 6,
        logo: "",
        date: "17.12.24",
        salesman: "DNS",
        ooo: "ООО ДНС",
        buyer: "6231246",
        inn: 7700000006,
        price: 2100,
        rows: [
            { id: 9, saleId: 6, title: "Товар I", qty: 1, sum: 2100 }
        ]
    },
    {
        id: 7,
        logo: "",
        date: "18.12.24",
        salesman: "Технопарк",
        ooo: "ООО Технопарк",
        buyer: "7231247",
        inn: 7700000007,
        price: 300,
        rows: [
            { id: 10, saleId: 7, title: "Товар J", qty: 3, sum: 300 }
        ]
    },
    {
        id: 8,
        logo: "",
        date: "19.12.24",
        salesman: "М.Видео",
        ooo: "ООО МВидео",
        buyer: "8231248",
        inn: 7700000008,
        price: 5000,
        rows: [
            { id: 11, saleId: 8, title: "Товар K", qty: 2, sum: 2500 },
            { id: 12, saleId: 8, title: "Товар L", qty: 5, sum: 2500 }
        ]
    },
    {
        id: 9,
        logo: "",
        date: "20.12.24",
        salesman: "Ашан",
        ooo: "ООО Ашан",
        buyer: "9231249",
        inn: 7700000009,
        price: 3000,
        rows: [
            { id: 13, saleId: 9, title: "Товар M", qty: 6, sum: 3000 }
        ]
    },
    {
        id: 10,
        logo: "",
        date: "21.12.24",
        salesman: "Пятёрочка",
        ooo: "ООО Пятёрочка",
        buyer: "10231250",
        inn: 7700000010,
        price: 700,
        rows: [
            { id: 14, saleId: 10, title: "Товар N", qty: 2, sum: 700 }
        ]
    },
    {
        id: 11,
        logo: "",
        date: "22.12.24",
        salesman: "Перекрёсток",
        ooo: "ООО Перекрёсток",
        buyer: "11231251",
        inn: 7700000011,
        price: 1200,
        rows: [
            { id: 15, saleId: 11, title: "Товар O", qty: 2, sum: 600 },
            { id: 16, saleId: 11, title: "Товар P", qty: 3, sum: 600 }
        ]
    },
    {
        id: 12,
        logo: "",
        date: "23.12.24",
        salesman: "Лента",
        ooo: "ООО Лента",
        buyer: "12231252",
        inn: 7700000012,
        price: 1800,
        rows: [
            { id: 17, saleId: 12, title: "Товар Q", qty: 4, sum: 1800 }
        ]
    },
    {
        id: 13,
        logo: "",
        date: "24.12.24",
        salesman: "Магнит",
        ooo: "ООО Магнит",
        buyer: "13231253",
        inn: 7700000013,
        price: 2100,
        rows: [
            { id: 18, saleId: 13, title: "Товар R", qty: 3, sum: 2100 }
        ]
    },
    {
        id: 14,
        logo: "",
        date: "25.12.24",
        salesman: "Карусель",
        ooo: "ООО Карусель",
        buyer: "14231254",
        inn: 7700000014,
        price: 600,
        rows: [
            { id: 19, saleId: 14, title: "Товар S", qty: 2, sum: 600 }
        ]
    },
    {
        id: 15,
        logo: "",
        date: "26.12.24",
        salesman: "Эльдорадо",
        ooo: "ООО Эльдорадо",
        buyer: "15231255",
        inn: 7700000015,
        price: 3100,
        rows: [
            { id: 20, saleId: 15, title: "Товар T", qty: 1, sum: 3100 }
        ]
    },
    {
        id: 16,
        logo: "",
        date: "27.12.24",
        salesman: "Юлмарт",
        ooo: "ООО Юлмарт",
        buyer: "16231256",
        inn: 7700000016,
        price: 750,
        rows: [
            { id: 21, saleId: 16, title: "Товар U", qty: 3, sum: 750 }
        ]
    },
    {
        id: 17,
        logo: "",
        date: "28.12.24",
        salesman: "Окей",
        ooo: "ООО Окей",
        buyer: "17231257",
        inn: 7700000017,
        price: 2300,
        rows: [
            { id: 22, saleId: 17, title: "Товар V", qty: 2, sum: 2300 }
        ]
    },
    {
        id: 18,
        logo: "",
        date: "29.12.24",
        salesman: "Декатлон",
        ooo: "ООО Декатлон",
        buyer: "18231258",
        inn: 7700000018,
        price: 900,
        rows: [
            { id: 23, saleId: 18, title: "Товар W", qty: 3, sum: 900 }
        ]
    },
    {
        id: 19,
        logo: "",
        date: "30.12.24",
        salesman: "Икеа",
        ooo: "ООО Икеа",
        buyer: "19231259",
        inn: 7700000019,
        price: 4700,
        rows: [
            { id: 24, saleId: 19, title: "Товар X", qty: 1, sum: 4700 }
        ]
    },
    {
        id: 20,
        logo: "",
        date: "31.12.24",
        salesman: "Зенден",
        ooo: "ООО Зенден",
        buyer: "20231260",
        inn: 7700000020,
        price: 670,
        rows: [
            { id: 25, saleId: 20, title: "Товар Y", qty: 2, sum: 670 }
        ]
    },
    {
        id: 21,
        logo: "",
        date: "01.01.25",
        salesman: "Спортмастер",
        ooo: "ООО Спортмастер",
        buyer: "21231261",
        inn: 7700000021,
        price: 2700,
        rows: [
            { id: 26, saleId: 21, title: "Товар Z", qty: 3, sum: 2700 }
        ]
    },
    {
        id: 22,
        logo: "",
        date: "02.01.25",
        salesman: "Ситилинк",
        ooo: "ООО Ситилинк",
        buyer: "22231262",
        inn: 7700000022,
        price: 1350,
        rows: [
            { id: 27, saleId: 22, title: "Товар AA", qty: 1, sum: 1350 }
        ]
    },
    {
        id: 23,
        logo: "",
        date: "03.01.25",
        salesman: "Детский мир",
        ooo: "ООО Детский Мир",
        buyer: "23231263",
        inn: 7700000023,
        price: 980,
        rows: [
            { id: 28, saleId: 23, title: "Товар AB", qty: 2, sum: 980 }
        ]
    },
    {
        id: 24,
        logo: "",
        date: "04.01.25",
        salesman: "Рив Гош",
        ooo: "ООО Рив Гош",
        buyer: "24231264",
        inn: 7700000024,
        price: 1600,
        rows: [
            { id: 29, saleId: 24, title: "Товар AC", qty: 2, sum: 1600 }
        ]
    },
    {
        id: 25,
        logo: "",
        date: "05.01.25",
        salesman: "Зара",
        ooo: "ООО Зара",
        buyer: "25231265",
        inn: 7700000025,
        price: 2000,
        rows: [
            { id: 30, saleId: 25, title: "Товар AD", qty: 1, sum: 2000 }
        ]
    },
    {
        id: 26,
        logo: "",
        date: "06.01.25",
        salesman: "H&M",
        ooo: "ООО Эйч Энд Эм",
        buyer: "26231266",
        inn: 7700000026,
        price: 1450,
        rows: [
            { id: 31, saleId: 26, title: "Товар AE", qty: 3, sum: 1450 }
        ]
    },
    {
        id: 27,
        logo: "",
        date: "07.01.25",
        salesman: "Gloria Jeans",
        ooo: "ООО Глория Джинс",
        buyer: "27231267",
        inn: 7700000027,
        price: 580,
        rows: [
            { id: 32, saleId: 27, title: "Товар AF", qty: 2, sum: 580 }
        ]
    },
    {
        id: 28,
        logo: "",
        date: "08.01.25",
        salesman: "Reserved",
        ooo: "ООО Резервед",
        buyer: "28231268",
        inn: 7700000028,
        price: 1890,
        rows: [
            { id: 33, saleId: 28, title: "Товар AG", qty: 2, sum: 1890 }
        ]
    },
    {
        id: 29,
        logo: "",
        date: "09.01.25",
        salesman: "Bershka",
        ooo: "ООО Бершка",
        buyer: "29231269",
        inn: 7700000029,
        price: 930,
        rows: [
            { id: 34, saleId: 29, title: "Товар AH", qty: 3, sum: 930 }
        ]
    },
    {
        id: 30,
        logo: "",
        date: "10.01.25",
        salesman: "Pull&Bear",
        ooo: "ООО Пулл энд Бир",
        buyer: "30231270",
        inn: 7700000030,
        price: 1100,
        rows: [
            { id: 35, saleId: 30, title: "Товар AI", qty: 2, sum: 1100 }
        ]
    }
];

export function useLoadReceipts({ endpoint, mode }: UseLoadReceiptsParams) {
    const [items, setItems] = useState<Receipt[]>(checks);
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
