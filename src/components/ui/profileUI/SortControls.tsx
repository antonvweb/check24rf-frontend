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
            <button className={styles.btnKey} id="date" onClick={() => toggleOrder("date")}>
                <span>Дата</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5.61451 6.59448C5.8145 6.83695 6.18597 6.83694 6.38596 6.59446L11 1" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
            <button className={styles.btnKey} id="salesman" onClick={() => toggleOrder("salesman")}>
                <span>Продавец</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5.61451 6.59448C5.8145 6.83695 6.18597 6.83694 6.38596 6.59446L11 1" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
            <button className={styles.btnKey} id="buyer" onClick={() => toggleOrder("buyer")}>
                <span>Покупатель</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5.61451 6.59448C5.8145 6.83695 6.18597 6.83694 6.38596 6.59446L11 1" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
            <span>ИНН</span>
            <button className={styles.btnKey} id="price" onClick={() => toggleOrder("price")}>
                <span>Стоимость</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5.61451 6.59448C5.8145 6.83695 6.18597 6.83694 6.38596 6.59446L11 1" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    );
}
