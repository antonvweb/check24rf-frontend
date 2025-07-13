import styles from '@/styles/profile/checkList/checkItem.module.css';
import {CheckItemProps} from "@/components/types/interfaces";
import { PayModel } from "@/components/ui/profileUI/PayModel";
import {useEffect, useState} from "react";

export const MultiListPlaceholder = ({ items, onRemove }: CheckItemProps) => {
    const [isPayMenuVisible, setIsPayMenuVisible] = useState(false);

    const handleRemoveAll = () => {
        items.forEach(item => onRemove(item.id));
    };

    useEffect(() => {
        document.body.style.overflow = isPayMenuVisible ? 'hidden' : '';
    }, [isPayMenuVisible]);

    const openPayMenu   = () => setIsPayMenuVisible(true);
    const closePayMenu  = () => setIsPayMenuVisible(false);
    const sumReceipts = items.length * 12;

    return (
        <div className={styles.checkItem}>
            <div className={styles.multiChecks}>
                <header className={styles.multiTop}>
                    <div className={styles.center}>
                        <span>ВЫБРАННЫЕ ЧЕКИ</span>
                    </div>
                    <button type="button" className={styles.closeBtn}  onClick={handleRemoveAll}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                            <path d="M2 2L24 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M24 2L2 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </button>
                </header>
                <div className={styles.multiCharacteristics}>
                    <section className={styles.multiChecksList}>
                        <div className={styles.top}>
                            <span>ПРОДАВЕц</span>
                            <span>ПОКУПАТЕЛЬ</span>
                            <span>СУММА, ₽</span>
                        </div>
                        <div className={styles.itemChecksList}>
                            {items.map((r, i) => (
                                <div key={i} className={styles.item}>
                                    <div className={styles.salesManData}>
                                        <span className={styles.salesman}>{r.salesman}</span>
                                        <span className={styles.ooo}>{r.ooo}</span>
                                    </div>
                                    <span className={styles.buyer}>{r.buyer}</span>
                                    <span className={styles.price}>{r.price.toFixed(2)} ₽</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.bottom}>
                            <span>СУММА ВЫБРАННЫХ ЧЕКОВ:</span>
                            <span>{sumReceipts} ₽</span>
                        </div>
                    </section>
                </div>
                <section className={styles.btnBottom}>
                    <button type={"button"} className={styles.buyChecks} onClick={openPayMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="16" viewBox="0 0 21 16" fill="none">
                            <path d="M0 2.66667C0 1.95942 0.276562 1.28115 0.768845 0.781048C1.26113 0.280951 1.92881 0 2.625 0H18.375C19.0712 0 19.7389 0.280951 20.2312 0.781048C20.7234 1.28115 21 1.95942 21 2.66667V4H0V2.66667ZM0 6.66667V13.3333C0 14.0406 0.276562 14.7189 0.768845 15.219C1.26113 15.719 1.92881 16 2.625 16H18.375C19.0712 16 19.7389 15.719 20.2312 15.219C20.7234 14.7189 21 14.0406 21 13.3333V6.66667H0ZM3.9375 9.33333H5.25C5.5981 9.33333 5.93194 9.47381 6.17808 9.72386C6.42422 9.97391 6.5625 10.313 6.5625 10.6667V12C6.5625 12.3536 6.42422 12.6928 6.17808 12.9428C5.93194 13.1929 5.5981 13.3333 5.25 13.3333H3.9375C3.5894 13.3333 3.25556 13.1929 3.00942 12.9428C2.76328 12.6928 2.625 12.3536 2.625 12V10.6667C2.625 10.313 2.76328 9.97391 3.00942 9.72386C3.25556 9.47381 3.5894 9.33333 3.9375 9.33333Z" fill="white"/>
                        </svg>
                        <span>Оплатить чеки</span>
                    </button>
                </section>
                {isPayMenuVisible && (
                    <>
                        <div className={styles.modalOverlay} onClick={closePayMenu} />
                        {/* PayModel ловит клики внутри и НЕ закрывает модалку */}
                        <PayModel items={items} isVisible={true} />
                    </>
                )}
            </div>
        </div>
    );
}