'use client'

import styles from "@/styles/profile/account/changeBasicAltInfo.module.css"
import {ErrorPhoneValid} from "@/components/ui/loginUI/errorModule/ErrorPhoneValid";
import {useAuth} from "@/context/contextAuth";

type ChangeType = "phone" | "email";

interface ChangeBasicAltInfoProps {
    type: ChangeType | null;
    onClose: () => void;
}

export const ChangeBasicAltInfo = ({type, onClose}:ChangeBasicAltInfoProps) => {

    const {
        phone
    } = useAuth();

    return (
        <div className={styles.changeBasicAltInfo}>
            <div className={styles.top}>
                <span>
                    {type === "phone" ? "Изменить дополнительный номер телефона" : "Изменить дополнительную почту"}
                </span>
                <div className={styles.closeButton} onClick={() => onClose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <path d="M2 2L24 24" stroke="var(--svg-primary)" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M24 2L2 24" stroke="var(--svg-primary)" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>
            <form className={styles.changeForm} onSubmit={(e) => {
                e.preventDefault();
            }}>
                <input
                    className={styles.changeInput}
                    type={type === "phone" ? "tel" : "email"}
                    placeholder={
                        type === "phone"
                            ? "+7 (XXX) XXX-XX-XX"
                            : "example@example.com"
                    }
                />
                <ErrorPhoneValid isPhoneValid={phone.replace(/\D/g, '').replace(/^7|8/, '').slice(0, 10).length === 10} isRussianPhoneValid={true}/>
                <button
                    type="submit"
                    className={styles.changeButton}
                >
                    Изменить
                </button>
            </form>
        </div>
    )
}