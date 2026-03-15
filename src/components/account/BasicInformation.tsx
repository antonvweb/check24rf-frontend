import styles from "@/styles/profile/account/account.module.css";
import {useEffect, useState} from "react";
import {ChangeBasicAltInfo} from "@/components/account/ChangeBasicAltInfo";
import {useUser} from "@/context/UserContext";
import {formatPhone} from "@/hooks/profile/usePhoneFormat";

type ChangeType = "phone" | "email";

export const BasicInformation = () => {
    const [isChangeModuleVisible, setIsChangeModuleVisible] = useState(false);
    const [changeType, setChangeType] = useState<ChangeType | null>(null);
    const { currentUser } = useUser();


    const openChangeMenu = (type: ChangeType) => {
        setChangeType(type);
        setIsChangeModuleVisible(true);
    };

    const closeChangeMenu = () => {
        setIsChangeModuleVisible(false);
        setChangeType(null); // Сбрасываем тип при закрытии
    };

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = isChangeModuleVisible ? 'hidden' : '';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isChangeModuleVisible]);

    return(
        <div className={styles.basicInformation}>
            <div className={styles.titleWrapper}>
                <div className={styles.title}>Основная информация</div>
            </div>
            <div className={styles.content}>
                <div className={styles.info}>
                    <div className={styles.column}>
                        <div className={styles.mainInfo}>
                            <span>Номер телефона</span>
                            <span>{formatPhone(currentUser?.phoneNumber as string)}</span>
                        </div>
                        <div className={styles.secondInfo}>
                            <span>Дополнительный</span>
                            <span>{currentUser?.phoneNumberAlt ? formatPhone(currentUser?.phoneNumberAlt as string) : "Не установлено"}</span>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.mainInfo}>
                            <span>Основной Email</span>
                            <span>{currentUser?.email ? currentUser?.email : "Не установлено"}</span>
                        </div>
                        <div className={styles.secondInfo}>
                            <span>Дополнительный</span>
                            <span>{currentUser?.emailAlt ? currentUser?.emailAlt : "Не установлено"}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.changeBtns}>
                    <button type={"button"} onClick={() => openChangeMenu("phone")}>Сменить дополнительный номер</button>
                    <button type={"button"}  onClick={() => openChangeMenu("email")}>Сменить дополнительный Email</button>
                    {currentUser?.partnerConnected && (
                        <button
                            type="button"
                            onClick={() => {
                                window.open("https://dr.stm-labs.ru/partners", "_blank", "noopener,noreferrer");
                            }}
                        >
                            Отозвать доступ
                        </button>
                    )}
                </div>
            </div>
            {isChangeModuleVisible && (
                <>
                    <div className={styles.modalOverlay} onClick={closeChangeMenu} />
                    <ChangeBasicAltInfo type={changeType} onClose={closeChangeMenu} />
                </>
            )}
        </div>
    )
}