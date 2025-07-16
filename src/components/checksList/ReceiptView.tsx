
import styles from '@/styles/profile/checkList/checkItem.module.css';
import {Receipt} from "@/components/types/interfaces";
import {ContextMenuSimple} from "@/components/ui/profileUI/ContextMenuSimple";
import React, {useState} from "react";
import {DownloadModal} from "@/components/ui/profileUI/DownloadModal";

interface Props {
    receipt: Receipt;
    onRemove: (id: number) => void;
    mode?: string;
}

export const ReceiptView = ({ receipt, onRemove, mode }: Props) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isOpenDownloadModal, setIsOpenDownloadModal] = useState(false);

    const toggleMenu = () => setIsMenuVisible(p => !p);

    const handleDownload = () => {
        openOpenDownloadModal();
        setIsMenuVisible(false);
    };

    const handleArchive = () => {
        setIsMenuVisible(false);
    };

    const openOpenDownloadModal   = () => setIsOpenDownloadModal(true);
    const closeOpenDownloadModal  = () => setIsOpenDownloadModal(false);

    return (
        <div className={styles.checkItem}>
            <div className={styles.haveChek}>
                <header className={styles.top}>
                    <button type="button" className={styles.moreFunc} onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="6" viewBox="0 0 24 6">
                            <circle cx="21" cy="3" r="3" transform="rotate(90 21 3)" />
                            <circle cx="12" cy="3" r="3" transform="rotate(90 12 3)" />
                            <circle cx="3" cy="3" r="3" transform="rotate(90 3 3)" />
                        </svg>
                    </button>
                    <ContextMenuSimple
                        isVisible={isMenuVisible}
                        onDownload={handleDownload}
                        onArchive={handleArchive}
                        mode={mode}
                    />

                    <div className={styles.center}>
                        <span>КАССОВЫЙ ЧЕК</span>
                        <span>ПРИХОД</span>
                    </div>

                    <button type="button" className={styles.closeBtn} onClick={() => onRemove(receipt.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                            <path d="M2 2L24 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M24 2L2 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </button>
                </header>

                <div className={styles.characteristics}>
                    <section className={styles.section1}>
                        <div className={styles.top}>
                            <span>ПРЕДМЕТ РАСЧЁТА</span>
                            <span>КОЛ-ВО</span>
                            <span>СУММА, ₽</span>
                        </div>
                        <div className={styles.name}>
                            {receipt.rows.map((r, i) => (
                                <div key={i} className={styles.data}>
                                    <span>{i + 1}. {r.title}</span>
                                    <span>{r.qty}</span>
                                    <span>{r.sum.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section2}>
                        <div className={styles.result}>
                            <span>ИТОГ:</span>
                            <span>{receipt.price.toFixed(2)}</span>
                        </div>
                        <div className={styles.data}>
                            <span>Наличные</span>
                            <span>0,00</span>
                        </div>
                        <div className={styles.data}>
                            <span>Безналичные</span>
                            <span>{receipt.price.toFixed(2)}</span>
                        </div>
                        <div className={styles.data}>
                            <span>Предоплата (аванс)</span>
                            <span>0,00</span>
                        </div>
                    </section>

                    <section className={styles.section3}>
                        <div className={styles.left}>
                            <div className={styles.data}>
                                <span>ИНН</span>
                                <span>{receipt.inn}</span>
                            </div>
                            <div className={styles.data}>
                                <span>№ Смены</span>
                                <span>96</span>
                            </div>
                            <div className={styles.data}>
                                <span>Чек №</span>
                                <span>786</span>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.data}>
                                <span>№ Авто</span>
                                <span>{receipt.buyer}</span>
                            </div>
                            <div className={styles.data}>
                                <span>СНО</span>
                                <span>ОСН</span>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section4}>
                        <div className={styles.data}>
                            <span>Дата/Время</span>
                            <span>{receipt.date}</span>
                        </div>
                        <div className={styles.data}>
                            <span>ФД №:</span>
                            <span>66751</span>
                        </div>
                        <div className={styles.data}>
                            <span>Версия ФФД:</span>
                            <span>1.2</span>
                        </div>
                        <div className={styles.data}>
                            <span>ФН:</span>
                            <span>738044081157303</span>
                        </div>
                        <div className={styles.data}>
                            <span>РН ККТ:</span>
                            <span>0007409073058882</span>
                        </div>
                        <div className={styles.data}>
                            <span>ФП:</span>
                            <span>3602869548</span>
                        </div>
                        <div className={styles.data}>
                            <span>Кассир:</span>
                            <span>--</span>
                        </div>
                        <div className={styles.data}>
                            <span>Место расчетов:</span>
                            <span>taxi.yandex.ru</span>
                        </div>
                        <div className={styles.data}>
                            <span>Адрес расчетов:</span>
                            <span>141281, Россия, Московская обл., г. Ивантеевка ул. Заречная, д. 1</span>
                        </div>
                    </section>

                    <div className={styles.qrCode}/>
                </div>

                <button type="button" className={styles.download} onClick={handleDownload}>Скачать</button>
            </div>
            {isOpenDownloadModal && (
                <>
                    <div className={styles.modalOverlay} onClick={closeOpenDownloadModal} />
                    <DownloadModal isVisible={true} close={closeOpenDownloadModal} />
                </>
            )}
        </div>
    );
}
