import styles from '@/styles/profile/checkList/checksList.module.css';
import React from "react";

interface SortControlsProps {
    setSortKey: (key: string) => void;
    setOrderDir: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}

export function SortControls({ setSortKey, setOrderDir }: SortControlsProps) {
    const toggleOrder = (key: string) => {
        setSortKey(key);
        setOrderDir((prev: "asc" | "desc") => prev === "asc" ? "desc" : "asc")
    };

    return (
        <div className={styles.sortedKey}>
            <button className={styles.btnKey} id="date" onClick={() => toggleOrder("date")}>Дата</button>
            <button className={styles.btnKey} id="salesman" onClick={() => toggleOrder("salesman")}>Продавец</button>
            <button className={styles.btnKey} id="buyer" onClick={() => toggleOrder("buyer")}>Покупатель</button>
            <span>ИНН</span>
            <button className={styles.btnKey} id="price" onClick={() => toggleOrder("price")}>Стоимость</button>
        </div>
    );
}
