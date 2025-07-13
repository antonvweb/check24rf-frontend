import { useState } from 'react';
import styles from '@/styles/profile/notifications/notifications.module.css';

interface NotificationItemProps {
    date: string;
    type: string;
    description: string;
}

export const NotificationItems = ({ date, type, description }: NotificationItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(prev => !prev);

    return (
        <div
            className={`${styles.item} ${isExpanded ? styles.activeItem : ''}`}
            onClick={toggleExpand}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') toggleExpand(); }}
            aria-expanded={isExpanded}
        >
            <div className={styles.top}>
                <div className={styles.date}>{date}</div>
                <div className={styles.info}>
                    <div className={styles.type}>{type}</div>
                    {!isExpanded && (
                        <div className={styles.description}>
                            {description.length > 120 ? description.slice(0, 120) + '...' : description}
                        </div>
                    )}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="17"
                    viewBox="0 0 19 17"
                    fill="none"
                    style={{
                        transition: 'transform 0.3s ease',
                        transform: isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M1 8.5H18M18 8.5L10.3095 1M18 8.5L10.3095 16"
                        stroke={isExpanded ? "#EBEBEB" : "#2E374F"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {isExpanded && <div className={styles.fullDescription}>{description}</div>}
        </div>
    );
};
