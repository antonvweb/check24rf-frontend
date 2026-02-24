import React, { createContext, useContext, useCallback, useState } from 'react';
import { ReceiptDto } from "@/api/types/typesMcoService";
import { generateReceiptId } from "@/api/types/typesMcoService";

interface CheckedItemsContextType {
    checkedIds: Set<number>;
    checkedItems: ReceiptDto[];
    toggleChecksItem: (item: ReceiptDto) => void;
    isChecked: (item: ReceiptDto) => boolean;
    clearCheckedItems: () => void;
}

const CheckedItemsContext = createContext<CheckedItemsContextType | null>(null);

export const CheckedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [checkedItems, setCheckedItems] = useState<ReceiptDto[]>([]);
    const isProcessingRef = React.useRef(false);

    const toggleChecksItem = useCallback((item: ReceiptDto) => {
        // Предотвращаем двойной вызов
        if (isProcessingRef.current) {
            return;
        }

        isProcessingRef.current = true;

        const itemId = item.id || generateReceiptId();

        setCheckedIds(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
                setCheckedItems(prevItems => {
                    const newItems = prevItems.filter(i => {
                        const iId = i.id || generateReceiptId();
                        return iId !== itemId;
                    });
                    isProcessingRef.current = false;
                    return newItems;
                });
            } else {
                next.add(itemId);
                setCheckedItems(prevItems => {
                    const itemExists = prevItems.some(i => {
                        const iId = i.id || generateReceiptId();
                        return iId === itemId;
                    });

                    if (itemExists) {
                        isProcessingRef.current = false;
                        return prevItems;
                    }

                    const newItems = [...prevItems, item];
                    isProcessingRef.current = false;
                    return newItems;
                });
            }
            return next;
        });
    }, []);

    const isChecked = useCallback((item: ReceiptDto): boolean => {
        const itemId = item.id || generateReceiptId();
        return checkedIds.has(itemId);
    }, [checkedIds]);

    function clearCheckedItems() {
        setCheckedIds(new Set());
        setCheckedItems([]);
    }

    const value: CheckedItemsContextType = {
        checkedIds,
        checkedItems,
        toggleChecksItem,
        isChecked,
        clearCheckedItems
    };

    return (
        <CheckedItemsContext.Provider value={value}>
            {children}
        </CheckedItemsContext.Provider>
    );
};

export const useCheckedItemsContext = (): CheckedItemsContextType => {
    const context = useContext(CheckedItemsContext);
    if (!context) {
        throw new Error('useCheckedItemsContext must be used within CheckedItemsProvider');
    }
    return context;
};
