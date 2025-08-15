import Image from "next/image";
import styles from "../../styles/profile/checkList/checkListItem.module.css";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import React, { useState, useEffect } from "react";
import { Receipt } from "@/components/types/interfaces";
import { RandomSvgLogo } from "@/components/ui/svgLogo/SvgLogoTypes";

interface CheckListItemProps {
    id: number;
    item: Receipt;
    isChecked: boolean;
    isItemChecked: boolean;
    onToggleChecks: (item: Receipt, checked: boolean) => void;
    onToggleCheck: (item: Receipt) => void;
    onContextMenuOpen: (item: Receipt, checked: boolean, x: number, y: number) => void;
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const CheckListItem = ({ id, item, isChecked, isItemChecked, onToggleChecks, onToggleCheck, onContextMenuOpen }: CheckListItemProps) => {
    const [checked, setChecked] = useState(isChecked);

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked, item.logo]);

    const handleChangeChecks = (value: boolean) => {
        setChecked(value);
        onToggleChecks(item, value);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenuOpen(item, checked, e.clientX, e.clientY);
    };

    return (
        <div
            className={`${styles.listItem} ${styles.fadeIn} ${(checked || isItemChecked) ? styles.selectListItem : ""}`}
            aria-checked={checked}
            style={{
                animationDelay: `${id * 50}ms`,
            }}
            onContextMenu={(e: React.MouseEvent) => {e.preventDefault()}}
        >
            {!item.logo ? (
                <RandomSvgLogo id={getRandomInt(0, 3)} />
            ) : (
                <Image src={"/yandex_taxi_1.png"} alt={`${item.salesman} logo`} width={28} height={28} />
            )}
            <div className={styles.characteristic} onClick={() => onToggleCheck(item)} onContextMenu={handleContextMenu}>
                <p>{item.date}</p>
                <div className="name">
                    <p>{item.salesman}</p>
                    <p>{item.ooo}</p>
                </div>
                <p>{item.buyer}</p>
                <p>{item.inn}</p>
                <p>{item.price} Руб.</p>
            </div>
            <CustomCheckbox
                checked={checked}
                onChange={(e) => handleChangeChecks(e.target.checked)}
            />
        </div>
    );
};

