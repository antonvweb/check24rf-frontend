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
            console.log('Already processing toggle, skipping');
            return;
        }

        isProcessingRef.current = true;

        console.log('toggleChecksItem called with item:', item);

        const itemId = item.id || generateReceiptId(item);
        console.log('Processing toggle for ID:', itemId);

        setCheckedIds(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                console.log('Removing item:', itemId);
                next.delete(itemId);
                setCheckedItems(prevItems => {
                    const newItems = prevItems.filter(i => {
                        const iId = i.id || generateReceiptId(i);
                        return iId !== itemId;
                    });
                    console.log('New checkedItems after removal:', newItems);
                    isProcessingRef.current = false;
                    return newItems;
                });
            } else {
                console.log('Adding item:', itemId);
                next.add(itemId);
                setCheckedItems(prevItems => {
                    const itemExists = prevItems.some(i => {
                        const iId = i.id || generateReceiptId(i);
                        return iId === itemId;
                    });

                    if (itemExists) {
                        console.log('Item already exists, skipping addition');
                        isProcessingRef.current = false;
                        return prevItems;
                    }

                    const newItems = [...prevItems, item];
                    console.log('New checkedItems after addition:', newItems);
                    isProcessingRef.current = false;
                    return newItems;
                });
            }
            return next;
        });
    }, []);

    const isChecked = useCallback((item: ReceiptDto): boolean => {
        const itemId = item.id || generateReceiptId(item);
        const checked = checkedIds.has(itemId);
        console.log(`isChecked for ID ${itemId}:`, checked);
        return checked;
    }, [checkedIds]);

    function clearCheckedItems() {
        console.log('Clearing all checked items');
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
