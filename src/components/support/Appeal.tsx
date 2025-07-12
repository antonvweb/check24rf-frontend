import styles from "@/styles/profile/support/support.module.css";

interface AppealProps {
    id: number;
    topic: string;
    description: string;
}

export const Appeal = ({id, topic, description} :AppealProps) => {
    return(
        <div className={styles.appeal}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <span>Обращение #{id + 1} (Тема: {topic})</span>
                </div>
                <div className={styles.description}>{description}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
                <path d="M1 14L8.5224 7.88775C8.76867 7.68765 8.76866 7.31173 8.52238 7.11164L0.999999 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </div>
    )
}