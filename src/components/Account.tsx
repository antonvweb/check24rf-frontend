import styles from "@/styles/profile/account/account.module.css";
import Reference from "@/components/Reference";
import ChangeTheme from "@/components/ChangeTheme";
import {BalanceChart} from "@/components/ui/BalanceChart";
import {PayModel} from "@/components/ui/profileUI/PayModel";
import {useEffect, useState} from "react";

const periods = [
    { label: "1 мес.", value: "1m" },
    { label: "3 мес.", value: "3m" },
    { label: "6 мес.", value: "6m" },
    { label: "1 год.", value: "1y" }
];

export interface userPaySubscribe {
    user: string;
    monthPeriod: string | null;
    price: number;
}

export const Account = () => {
    const [isPayMenuVisible, setIsPayMenuVisible] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string>("1m");

    const handleSelectPeriod = (period: string) => {
        console.log("Выбрано:", period); // ✅ Проверка
        setSelectedPeriod(period);
    };

    const user: userPaySubscribe = {
        user: "SERGEY BURUNOV",
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
        })(),
        price: (() => {
            switch (selectedPeriod) {
                case "1m":
                    return 100;
                case "3m":
                    return 300;
                case "6m":
                    return 600;
                case "1y":
                    return 1200;
                default:
                    return 0;
            }
        })()
    };


    useEffect(() => {
        document.body.style.overflow = isPayMenuVisible ? 'hidden' : '';
    }, [isPayMenuVisible]);

    const openPayMenu   = () => setIsPayMenuVisible(true);
    const closePayMenu  = () => setIsPayMenuVisible(false);

    return (
        <div className={styles.account}>
            <header className={styles.header}>
                <div className={styles.header__right}>
                    <Reference/>
                    <ChangeTheme/>
                </div>
            </header>
            <main className={styles.mainAccount}>
                <div className={styles.top}>
                    <span className={styles.welcome}>Добро пожаловать</span>
                    <span className={styles.description}>ЛИЧНЫЙ КАБИНЕТ, SERGEY BURUNOV</span>
                </div>
                <div className={styles.mainAccountContent}>
                    <section className={styles.mainSection}>
                        <section className={styles.infoSection}>
                            <div className={styles.basicInformation}>
                                <div className={styles.titleWrapper}>
                                    <div className={styles.title}>Основная информация</div>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.info}>
                                        <div className={styles.column}>
                                            <div className={styles.mainInfo}>
                                                <span>Номер телефона</span>
                                                <span>+7 (993) 477-07-90</span>
                                            </div>
                                            <div className={styles.secondInfo}>
                                                <span>Дополнительный</span>
                                                <span>+7 (987) 847-38-14</span>
                                            </div>
                                        </div>
                                        <div className={styles.column}>
                                            <div className={styles.mainInfo}>
                                                <span>Основной Email</span>
                                                <span>anton.volkov.04@list.ru</span>
                                            </div>
                                            <div className={styles.secondInfo}>
                                                <span>Дополнительный</span>
                                                <span>wweake1@gmail.com</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.changeBtns}>
                                        <button type={"button"}>Сменить дополнительный номер</button>
                                        <button type={"button"}>Сменить дополнительный Email</button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.subscription}>
                                <div className={styles.cardSubscribe}>
                                    <div className={styles.titleWrapper}>
                                        <div className={styles.title}>Статус подписки</div>
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.column}>
                                            <div className={styles.row}>
                                                <span>Дата начала</span>
                                                <span>23.06.2025</span>
                                            </div>
                                            <div className={styles.row}>
                                                <span>Дата окончания</span>
                                                <span>23.07.2025</span>
                                            </div>
                                        </div>
                                        <div className={styles.progressBar}/>
                                        <div className={styles.extend}>
                                            <span>Продлить на</span>
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
                                <div className={styles.autoPayment}>
                                    <span>Отключить автоплатёж</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="31" viewBox="0 0 35 31" fill="none">
                                        <path d="M2 15.5H33M33 15.5L18.9762 2M33 15.5L18.9762 29" stroke="#2E374F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </section>
                        <section className={styles.infoExpenses}>
                            <div className={styles.expensesPerMonth}>
                                <div className={styles.titleWrapper}>
                                    <div className={styles.title}>Расходы за месяц</div>
                                </div>
                                <div className={styles.expenses}>
                                    <div className={styles.amountOfExpenses}>
                                        <div className={styles.columnExpenses}>
                                            <div className={styles.titleExpenses}>Общее количество расходов</div>
                                            <div className={styles.infoExpenses}>1 153 153 501,42 ₽</div>
                                        </div>
                                        <div className={styles.columnExpenses}>
                                            <div className={styles.titleExpenses}>Количество расходов за 31 день</div>
                                            <div className={styles.infoExpenses}>32 986 623,21 ₽</div>
                                        </div>
                                    </div>
                                    <BalanceChart/>
                                </div>
                            </div>
                        </section>
                    </section>
                    <div className={styles.reklama}/>
                </div>
            </main>
        </div>
    )
}
