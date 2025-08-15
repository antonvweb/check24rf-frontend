import styles from "@/styles/profile/account/account.module.css";
import {useGetUserWithActiveCheck} from "@/hooks/profile/useGetUser";
import {useEffect, useState} from "react";
import {User} from "@/components/types/interfaces";
import {ChangeBasicAltInfo} from "@/components/account/ChangeBasicAltInfo";

type ChangeType = "phone" | "email";

export const BasicInformation = () => {
    const {getUser} = useGetUserWithActiveCheck();
    const [userData, setUserData] = useState<User | null>(null);
    const [isChangeModuleVisible, setIsChangeModuleVisible] = useState(false);
    const [changeType, setChangeType] = useState<ChangeType | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser();
                setUserData(user);
            } catch (err) {
                console.error(err instanceof Error ? err.message : 'Ошибка загрузки пользователя');
            }
        };
        fetchUser();
    }, [getUser]);


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
                            <span>{userData?.phoneNumber}</span>
                        </div>
                        <div className={styles.secondInfo}>
                            <span>Дополнительный</span>
                            <span>{userData?.phoneNumberAlt !== null ? userData?.phoneNumberAlt : "Не установлено"}</span>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.mainInfo}>
                            <span>Основной Email</span>
                            <span>{userData?.email !== null ? userData?.email : "Не установлено"}</span>
                        </div>
                        <div className={styles.secondInfo}>
                            <span>Дополнительный</span>
                            <span>{userData?.emailAlt !== null ? userData?.emailAlt : "Не установлено"}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.changeBtns}>
                    <button type={"button"} onClick={() => openChangeMenu("phone")}>Сменить дополнительный номер</button>
                    <button type={"button"}  onClick={() => openChangeMenu("email")}>Сменить дополнительный Email</button>
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