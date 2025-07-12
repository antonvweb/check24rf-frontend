import styles from '../../styles/profile/navigation.module.css'

export const Notifications = () => {
    return (
        <div className={styles.navItem}>
            <div className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 20 26" fill="none">
                    <path d="M9.63455 6.18966C16.0575 6.18966 16.0575 13.4885 16.0575 13.4885V20.3556C16.0575 20.6185 16.2112 20.8572 16.4506 20.966V20.966C17.1072 21.2645 16.8943 22.2471 16.1731 22.2471H3.09595C2.37476 22.2471 2.16191 21.2645 2.81845 20.966V20.966C3.05785 20.8572 3.21156 20.6185 3.21156 20.3556V13.4885C3.21156 13.4885 3.21156 6.18966 9.63455 6.18966ZM9.63455 6.18966V4" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M6.42279 25.1667H12.8458" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>
            <span>Уведомления</span>
        </div>
    )
}