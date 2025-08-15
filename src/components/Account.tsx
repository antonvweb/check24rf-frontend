import styles from "@/styles/profile/account/account.module.css";
import Reference from "@/components/Reference";
import ChangeTheme from "@/components/ChangeTheme";
import {InfoUser} from "@/components/account/InfoUser";
import {InfoExpenses} from "@/components/account/InfoExpenses";

export const Account = () => {
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
                        <InfoUser/>
                        <InfoExpenses />
                    </section>
                    <div className={styles.reklama}/>
                </div>
            </main>
        </div>
    )
}
