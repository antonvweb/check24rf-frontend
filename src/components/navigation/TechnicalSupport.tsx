import styles from '../../styles/profile/navigation.module.css'

export const TechnicalSupport = () => {
    return (
        <div className={styles.navItem}>
            <div className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path d="M13.7748 19.1355L9.16795 22.4888C7.73251 23.5336 5.71795 22.5083 5.71795 20.7328C5.71795 19.5333 4.74557 18.561 3.54609 18.561H3.35897C2.05615 18.561 1 17.5048 1 16.202V4C1 2.34315 2.34315 1 4 1H21C22.6569 1 24 2.34315 24 4V15.561C24 17.2178 22.6569 18.561 21 18.561H15.5403C14.9059 18.561 14.2878 18.7621 13.7748 19.1355Z" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="5.5" cy="9.5" r="1.5" fill="#2E374F"/>
                    <circle cx="12.5" cy="9.5" r="1.5" fill="#2E374F"/>
                    <circle cx="19.5" cy="9.5" r="1.5" fill="#2E374F"/>
                </svg>
            </div>
            <span>Тех. Поддержка</span>
        </div>
    )
}