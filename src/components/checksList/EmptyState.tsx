// components/EmptyState.tsx
import styles from '../../styles/profile/checkList/checkItem.module.css';

export const EmptyState = () => (
    <div className={styles.checkItem}>
        <div className={styles.notHaveChek}>
            <span>Выберите чек</span>
            <span>Чтобы здесь отобразился чек, выберите его в окне слева</span>
        </div>
    </div>
);
