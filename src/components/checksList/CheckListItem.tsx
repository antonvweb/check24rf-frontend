// CheckListItem.tsx
import styles from "../../styles/profile/checkList/checkListItem.module.css";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import React, { useCallback, useRef } from "react";
import {generateReceiptId, ReceiptDto} from "@/api/types/typesMcoService";
import {RandomSvgLogo} from "@/components/ui/svgLogo/SvgLogoTypes";
import { useCheckedItemsContext } from "@/context/CheckedItemsContext";

interface CheckListItemProps {
    id: number;
    item: ReceiptDto;
    onContextMenuOpen: (item: ReceiptDto, x: number, y: number) => void;
}

export const CheckListItem = ({ id, item, onContextMenuOpen }: CheckListItemProps) => {
    const { toggleChecksItem, isChecked } = useCheckedItemsContext();
    const isProcessingRef = useRef(false);

    const handleCheckboxChange = useCallback((e?: React.ChangeEvent<HTMLInputElement>) => {
        e?.stopPropagation();
        e?.nativeEvent?.stopImmediatePropagation();

        // Предотвращаем двойной вызов
        if (isProcessingRef.current) {
            console.log('Already processing, skipping');
            return;
        }

        isProcessingRef.current = true;

        console.log('CheckListItem handleCheckboxChange, item:', item);
        console.log('Generated ID:', item.id || generateReceiptId());

        // Вызываем toggle сразу
        toggleChecksItem(item);

        // Сбрасываем флаг после небольшой задержки
        setTimeout(() => {
            isProcessingRef.current = false;
        }, 100);
    }, [item, toggleChecksItem]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenuOpen(item, e.clientX, e.clientY);
    };

    const itemId = item.id || generateReceiptId();
    const checked = isChecked(item);
    console.log(`CheckListItem ${itemId} isChecked:`, checked);

    return (
        <div
            className={`${styles.listItem} ${styles.fadeIn} ${checked ? styles.selectListItem : ""}`}
            style={{ animationDelay: `${(id % 20) * 50}ms` }}
            onContextMenu={handleContextMenu}
            onClick={() => handleCheckboxChange()}
        >
            <RandomSvgLogo id={Math.floor(Math.random() * 4)} />
            <div className={styles.characteristic}>
                <p>{new Date(item.receiveDate).toLocaleDateString()}</p>
                <div className="name">
                    <p>{item.rawJson.user}</p>
                    <p>ИНН: {item.userInn}</p>
                </div>
                <p>{item.rawJson.buyerAddress || 'Адрес не указан'}</p>
                <p>{item.totalSum.toFixed(2)} ₽</p>
            </div>
            <CustomCheckbox
                checked={checked}
                onChange={handleCheckboxChange}
            />
        </div>
    );
};