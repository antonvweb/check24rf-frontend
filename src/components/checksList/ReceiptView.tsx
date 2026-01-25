
import styles from '@/styles/profile/checkList/checkItem.module.css';
import {ContextMenuSimple} from "@/components/ui/profileUI/ContextMenuSimple";
import React, {useEffect, useState} from "react";
import {DownloadModal} from "@/components/ui/profileUI/DownloadModal";
import {ReceiptDto} from "@/api/types/typesMcoService";

interface Props {
    receipt: ReceiptDto;
    onRemove: (id: number) => void;
    mode?: string;
}

export const ReceiptView = ({ receipt, onRemove, mode }: Props) => {
    console.log('ReceiptView rendered with receipt:', receipt);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isOpenDownloadModal, setIsOpenDownloadModal] = useState(false);

    const toggleMenu = () => setIsMenuVisible(p => !p);

    useEffect(() => {
        console.log(receipt);
    })

    const handleDownload = () => {
        openOpenDownloadModal();
        setIsMenuVisible(false);
    };

    const handleArchive = () => {
        setIsMenuVisible(false);
    };

    const openOpenDownloadModal   = () => setIsOpenDownloadModal(true);
    const closeOpenDownloadModal  = () => setIsOpenDownloadModal(false);

    const formatMoney = (value?: number) =>
        value ? (value / 100).toFixed(2) : '0.00';

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('ru-RU');

    const taxationMap: Record<number, string> = {
        1: 'ОСН',
        2: 'УСН (доход)',
        3: 'УСН (доход-расход)',
        4: 'ЕНВД',
        5: 'ЕСХН',
        6: 'ПСН',
    };


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

                    <button type="button" className={styles.closeBtn} onClick={() => onRemove(receipt.id as number)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                            <path d="M2 2L24 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M24 2L2 24" stroke="#2E374F" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </button>
                </header>

                <div className={styles.characteristics}>

                    {/* ТОВАРЫ */}
                    <section className={styles.section1}>
                        <div className={styles.top}>
                            <span>ПРЕДМЕТ РАСЧЁТА</span>
                            <span>КОЛ-ВО</span>
                            <span>СУММА, ₽</span>
                        </div>

                        <div className={styles.name}>
                            {receipt.rawJson.items.map((item, i) => (
                                <div key={i} className={styles.data}>
                                    <span>{i + 1}. {item.name}</span>
                                    <span>{item.quantity}</span>
                                    <span>{formatMoney(item.sum)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ИТОГИ */}
                    <section className={styles.section2}>
                        <div className={styles.result}>
                            <span>ИТОГ:</span>
                            <span>{receipt.totalSum.toFixed(2)}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Наличные</span>
                            <span>{formatMoney(receipt.rawJson.cashTotalSum)}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Безналичные</span>
                            <span>{formatMoney(receipt.rawJson.ecashTotalSum)}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Предоплата (аванс)</span>
                            <span>{formatMoney(receipt.rawJson.prepaidSum)}</span>
                        </div>
                    </section>

                    {/* РЕКВИЗИТЫ */}
                    <section className={styles.section3}>
                        <div className={styles.left}>
                            <div className={styles.data}>
                                <span>ИНН</span>
                                <span>{receipt.userInn}</span>
                            </div>

                            <div className={styles.data}>
                                <span>№ смены</span>
                                <span>{receipt.rawJson.shiftNumber}</span>
                            </div>

                            <div className={styles.data}>
                                <span>Чек №</span>
                                <span>{receipt.rawJson.fiscalDocumentNumber}</span>
                            </div>
                        </div>

                        <div className={styles.right}>
                            <div className={styles.data}>
                                <span>Телефон покупателя</span>
                                <span>{receipt.phone}</span>
                            </div>

                            <div className={styles.data}>
                                <span>СНО</span>
                                <span>{taxationMap[receipt.rawJson.taxationType]}</span>
                            </div>
                        </div>
                    </section>

                    {/* ФИСКАЛЬНЫЕ ДАННЫЕ */}
                    <section className={styles.section4}>
                        <div className={styles.data}>
                            <span>Дата / Время</span>
                            <span>{formatDate(receipt.receiptDateTime)}</span>
                        </div>

                        <div className={styles.data}>
                            <span>ФД №</span>
                            <span>{receipt.rawJson.fiscalDocumentNumber}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Версия ФФД</span>
                            <span>{receipt.rawJson.fiscalDocumentFormatVer}</span>
                        </div>

                        <div className={styles.data}>
                            <span>ФН</span>
                            <span>{receipt.rawJson.fiscalDriveNumber}</span>
                        </div>

                        <div className={styles.data}>
                            <span>РН ККТ</span>
                            <span>{receipt.rawJson.kktRegId}</span>
                        </div>

                        <div className={styles.data}>
                            <span>ФП</span>
                            <span>{receipt.rawJson.fiscalSign}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Кассир</span>
                            <span>{receipt.rawJson.operator || '—'}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Место расчётов</span>
                            <span>{receipt.rawJson.retailPlace}</span>
                        </div>

                        <div className={styles.data}>
                            <span>Адрес расчётов</span>
                            <span>{receipt.rawJson.retailPlaceAddress}</span>
                        </div>
                    </section>

                    <div className={styles.qrCode} />
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
