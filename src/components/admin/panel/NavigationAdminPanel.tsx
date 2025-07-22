import {motion} from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from "@/styles/admin/navigationAdminPanel.module.css";
import clsx from "clsx";

const ITEMS = [
    {
        id: 'main',
        label: 'Общие настройки',
    },
    {
        id: 'metrics',
        label: 'Метрика',
    },
];

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const NavigationAdminPanel = ({ activeTab, setActiveTab }: NavigationProps) => {
    const router = useRouter();

    const onClick = (id: string) => {
        setActiveTab(id);
        // Обновляем хеш в URL без перезагрузки страницы
        router.replace(`#${id}`, { scroll: false });
    };


    return (
        <div className={styles.navigationAdminPanel}>
            {ITEMS.map(i => {
                const isActive = i.id === activeTab;

                return (
                    <div
                        key={i.id}
                        className={clsx(styles.navItem)}
                        onClick={() => onClick(i.id)}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="navHighlight"
                                className={styles.highlight}
                                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                            />
                        )}
                        {i.label}
                    </div>
                );
            })}
        </div>
    )
}