import styles from "@/styles/profile/account/account.module.css";
import {PayModel} from "@/components/ui/profileUI/PayModel";
import React, {useEffect, useState} from "react";
import {userPaySubscribe} from "@/components/types/interfaces";

const periods = [
    { label: "1 мес.", value: "1m" },
    { label: "3 мес.", value: "3m" },
    { label: "6 мес.", value: "6m" },
    { label: "1 год.", value: "1y" }
];

export const Subscribe = () => {
    const [isPayMenuVisible, setIsPayMenuVisible] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string>("1m");

    const handleSelectPeriod = (period: string) => {
        console.log("Выбрано:", period); // ✅ Проверка
        setSelectedPeriod(period);
    };

    const openPayMenu  = () => setIsPayMenuVisible(true);

    const closePayMenu  = () => setIsPayMenuVisible(false);

    const token = localStorage.getItem("userToken") ?? "";

    const user: userPaySubscribe = {
        userToken: token,
        monthPeriod: (() => {
            switch (selectedPeriod) {
                case "1m":
                    return '1 месяц';
                case "3m":
                    return "3 месяца";
                case "6m":
                    return '6 месяцев';
                case "1y":
                    return '1 год';
                default:
                    return null;
            }
        })()
    };

    useEffect(() => {
        document.body.style.overflow = isPayMenuVisible ? 'hidden' : '';
    }, [isPayMenuVisible]);

    return (
        <div className={styles.subscription}>
            <div className={styles.cardSubscribe}>
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>Статус подписки</div>
                </div>
                <div className={styles.info}>
                    <div className={styles.mySubscribe}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <span>Дата начала</span>
                                <span>--.--.----</span>
                            </div>
                            <div className={styles.row}>
                                <span>Дата окончания</span>
                                <span>--.--.----</span>
                            </div>
                        </div>
                        <div
                            className={styles.progressBar}
                            style={{ '--progress-width': "1%" } as React.CSSProperties}
                        />
                    </div>
                    <div className={styles.extend}>
                        <span>Приобрести на</span>
                        {periods.map(({ label, value }) => (
                            <button
                                key={value}
                                type="button"
                                className={selectedPeriod === value ? styles.activePeriod : styles.btnPeriod}
                                onClick={() => handleSelectPeriod(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <button type={"button"} className={styles.payBtn} onClick={openPayMenu}>Перейти к оплате</button>
                {isPayMenuVisible && (
                    <>
                        <div className={styles.modalOverlay} onClick={closePayMenu} />
                        <PayModel type={"subscribe"} subscription={user} isVisible={true} />
                    </>
                )}
            </div>
            <div className={styles.autoPayment}
                 style={{
                    cursor: "pointer",
                    pointerEvents: "auto",
                    opacity: 1, // для визуального эффекта
                }}
            >
                <span>Отключить автоплатёж</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="31" viewBox="0 0 35 31" fill="none">
                    <path d="M2 15.5H33M33 15.5L18.9762 2M33 15.5L18.9762 29" stroke="#2E374F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    )
}