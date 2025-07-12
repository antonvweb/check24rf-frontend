import styles from '../../styles/profile/navigation.module.css'

export const Checks = () => {
    return (
        <div className={styles.navItemSelected}>
            <div className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
                    <path d="M3.52002 5.19995H19.48" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M6.03998 8.55994H16.96" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8.56 11.9199H14.44" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M22 1.99873V21.8444C22 22.3967 21.5447 22.8344 21.0218 22.6569C19.3576 22.0918 17.5152 20.4133 16.7455 20.4133C15.82 20.4133 15.2018 22.84 11.4928 22.84C7.78368 22.84 7.4764 20.4133 6.54732 20.4133C5.74475 20.4133 4.03582 22.2241 1.99022 22.7173C1.45332 22.8467 1 22.3944 1 21.8421V1.99448C1 1.4422 1.44772 1 2 1H21C21.5523 1 22 1.44645 22 1.99873Z" stroke="white" strokeWidth="1.5"/>
                </svg>
            </div>
            <span>Чеки</span>
        </div>
    )
}