import styles from "@/styles/profile/account/account.module.css";
import {BalanceChart} from "@/components/ui/BalanceChart";
import {useAuthFormContext} from "@/context/AuthFormProvider";


export const InfoExpenses = () => {
    const {
        isSubscribed
    } = useAuthFormContext();

    return (
        <section className={styles.infoExpenses}>
            <div className={styles.expensesPerMonth}>
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>Расходы за месяц</div>
                </div>
            {isSubscribed ?
                (
                    <>
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
                    </>

                )
                :
                    (
                        <div className={styles.isNotSubscribedForExpenses}>
                            <span>Данный раздел доступен только для пользователей с активной подпиской. Оформите подписку, чтобы получить к нему доступ.</span>
                        </div>
                    )
            }
            </div>

        </section>
    )
}