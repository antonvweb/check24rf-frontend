import styles from "@/styles/profile/account/account.module.css";
import {BalanceChart} from "@/components/ui/BalanceChart";


export const InfoExpenses = () => {
    return (
        <section className={styles.infoExpenses}>
            <div className={styles.expensesPerMonth}>
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>Расходы за месяц</div>
                </div>
            {(
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
            }
            </div>

        </section>
    )
}