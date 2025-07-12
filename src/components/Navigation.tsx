'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {motion} from 'framer-motion';
import clsx from 'clsx';
import styles from '../styles/profile/navigation.module.css';

const ChekIcon = ({ fill }: { fill: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
        <motion.path
            d="M3.52002 5.19995H19.48"
            stroke={fill}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
        <motion.path
            d="M6.03998 8.56006H16.96"
            stroke={fill}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
        <motion.path
            d="M8.56 11.9199H14.44"
            stroke={fill}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
        <motion.path
            d="M22 1.99873V21.8444C22 22.3967 21.5447 22.8344 21.0218 22.6569C19.3576 22.0918 17.5152 20.4133 16.7455 20.4133C15.82 20.4133 15.2018 22.84 11.4928 22.84C7.78368 22.84 7.4764 20.4133 6.54732 20.4133C5.74475 20.4133 4.03582 22.2241 1.99022 22.7173C1.45332 22.8467 1 22.3944 1 21.8421V1.99448C1 1.4422 1.44772 1 2 1H21C21.5523 1 22 1.44645 22 1.99873Z"
            stroke={fill}
            strokeWidth="1.5"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
    </svg>
);

const ArchiveIcon = ({fill}: {fill: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
        <motion.path
            d="M0 2.875C0 2.49375 0.15145 2.12812 0.421034 1.85853C0.690618 1.58895 1.05625 1.4375 1.4375 1.4375H21.5625C21.9437 1.4375 22.3094 1.58895 22.579 1.85853C22.8485 2.12812 23 2.49375 23 2.875V5.75C23 6.13125 22.8485 6.49688 22.579 6.76647C22.3094 7.03605 21.9437 7.1875 21.5625 7.1875V17.9688C21.5625 18.9219 21.1839 19.836 20.5099 20.5099C19.836 21.1839 18.9219 21.5625 17.9688 21.5625H5.03125C4.07813 21.5625 3.16404 21.1839 2.49009 20.5099C1.81613 19.836 1.4375 18.9219 1.4375 17.9688V7.1875C1.05625 7.1875 0.690618 7.03605 0.421034 6.76647C0.15145 6.49688 0 6.13125 0 5.75V2.875ZM2.875 7.1875V17.9688C2.875 18.5406 3.10218 19.0891 3.50655 19.4935C3.91093 19.8978 4.45938 20.125 5.03125 20.125H17.9688C18.5406 20.125 19.0891 19.8978 19.4935 19.4935C19.8978 19.0891 20.125 18.5406 20.125 17.9688V7.1875H2.875ZM21.5625 2.875H1.4375V5.75H21.5625V2.875ZM7.1875 10.7812C7.1875 10.5906 7.26323 10.4078 7.39802 10.273C7.53281 10.1382 7.71563 10.0625 7.90625 10.0625H15.0938C15.2844 10.0625 15.4672 10.1382 15.602 10.273C15.7368 10.4078 15.8125 10.5906 15.8125 10.7812C15.8125 10.9719 15.7368 11.1547 15.602 11.2895C15.4672 11.4243 15.2844 11.5 15.0938 11.5H7.90625C7.71563 11.5 7.53281 11.4243 7.39802 11.2895C7.26323 11.1547 7.1875 10.9719 7.1875 10.7812Z"
            fill={fill}
            animate={{ fill: fill }}
            transition={{ duration: 0.2 }}
        />
    </svg>
);

const NotificationsIcon = ({fill}: {fill: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="24" viewBox="0 0 19 24" fill="none">
        <motion.path
            d="M9.30884 0.75C12.175 0.750133 14.4192 2.92651 14.4192 5.5166C14.419 8.10655 12.1748 10.2821 9.30884 10.2822C6.4427 10.2822 4.19769 8.10663 4.19751 5.5166C4.19751 2.92644 6.44259 0.75 9.30884 0.75Z"
            stroke={fill} strokeWidth="1.5"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
        <motion.path
            d="M9.30859 13.8499C10.8983 13.8499 13.0794 14.6278 14.876 15.8684C16.704 17.1307 17.8672 18.6807 17.8672 20.0803C17.8671 20.8804 17.7073 21.3525 17.4756 21.6565C17.2462 21.9574 16.8655 22.1995 16.1992 22.3723C15.5244 22.5473 14.6321 22.6323 13.4678 22.6682C12.3073 22.704 10.9366 22.6907 9.30859 22.6907C7.6808 22.6907 6.31074 22.7039 5.15039 22.6682C3.98603 22.6324 3.09379 22.5473 2.41895 22.3723C1.75234 22.1994 1.37103 21.9575 1.1416 21.6565C0.909934 21.3525 0.75006 20.8804 0.75 20.0803C0.75 18.6806 1.9141 17.1308 3.74219 15.8684C5.5386 14.628 7.71897 13.8499 9.30859 13.8499Z"
            stroke={fill} strokeWidth="1.5"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
    </svg>
);

const ProfileIcon = ({fill}: {fill: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 20 26" fill="none">
        <motion.path
            d="M9.63455 6.18966C16.0575 6.18966 16.0575 13.4885 16.0575 13.4885V20.3556C16.0575 20.6185 16.2112 20.8572 16.4506 20.966V20.966C17.1072 21.2645 16.8943 22.2471 16.1731 22.2471H3.09595C2.37476 22.2471 2.16191 21.2645 2.81845 20.966V20.966C3.05785 20.8572 3.21156 20.6185 3.21156 20.3556V13.4885C3.21156 13.4885 3.21156 6.18966 9.63455 6.18966ZM9.63455 6.18966V4"
            stroke={fill} strokeWidth="1.5" strokeLinecap="round"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
        <motion.path d="M6.42279 25.1667H12.8458" stroke={fill} strokeWidth="1.5" strokeLinecap="round"
                     animate={{ stroke: fill }}
                     transition={{ duration: 0.2 }}
        />
    </svg>
);

const SupportIcon = ({fill}: {fill: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <motion.path
            d="M13.7748 19.1355L9.16795 22.4888C7.73251 23.5336 5.71795 22.5083 5.71795 20.7328C5.71795 19.5333 4.74557 18.561 3.54609 18.561H3.35897C2.05615 18.561 1 17.5048 1 16.202V4C1 2.34315 2.34315 1 4 1H21C22.6569 1 24 2.34315 24 4V15.561C24 17.2178 22.6569 18.561 21 18.561H15.5403C14.9059 18.561 14.2878 18.7621 13.7748 19.1355Z"
            stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            animate={{ stroke: fill }}
            transition={{ duration: 0.2 }}
        />
        <motion.circle cx="5.5" cy="9.5" r="1.5" fill={fill}
                       animate={{ fill: fill }}
                       transition={{ duration: 0.2 }}
        />
        <motion.circle cx="12.5" cy="9.5" r="1.5" fill={fill}
                       animate={{ fill: fill }}
                       transition={{ duration: 0.2 }}
        />
        <motion.circle cx="19.5" cy="9.5" r="1.5" fill={fill}
                       animate={{ fill: fill }}
                       transition={{ duration: 0.2 }}
        />
    </svg>
);

const ITEMS = [{
    id: 'checks',
    label: 'Чеки',
    icon: (fill: string) => <ChekIcon fill={fill} />
}, {
    id: 'archive',
    label: 'Архив',
    icon: (fill: string) => <ArchiveIcon fill={fill} />
}, {
    id: 'account',
    label: 'Личный кабинет',
    icon: (fill: string) => <NotificationsIcon fill={fill} />
}, {
    id: 'notif',
    label: 'Уведомления',
    icon: (fill: string) => <ProfileIcon fill={fill} />
}, {
    id: 'support',
    label: 'Поддержка',
    icon: (fill: string) => <SupportIcon fill={fill} />
},];

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
    const router = useRouter();

    // Синхронизация active с текущим хешем в URL
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ITEMS.some(i => i.id === hash)) {
            setActiveTab(hash);
        }
    }, [setActiveTab]);

    const onClick = (id: string) => {
        setActiveTab(id);
        // Обновляем хеш в URL без перезагрузки страницы
        router.replace(`#${id}`, { scroll: false });
    };

    return (
        <div className={styles.navigation}>
            {ITEMS.map(i => {
                const isActive = i.id === activeTab;
                const fillColor = isActive ? '#FFFFFF' : '#2E374F';

                return (
                    <div
                        key={i.id}
                        className={clsx(styles.navItem, { [styles.selected]: isActive })}
                        onClick={() => onClick(i.id)}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="navHighlight"
                                className={styles.highlight}
                                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                            />
                        )}
                        <span className={styles.icon}>{i.icon(fillColor)}</span>
                        {i.label}
                    </div>
                );
            })}
        </div>
    );
};

