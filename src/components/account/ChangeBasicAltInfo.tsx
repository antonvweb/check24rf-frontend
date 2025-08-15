import styles from "@/styles/profile/account/changeBasicAltInfo.module.css"
import {changeAltData} from "@/utils/profile/account/changeAltNumberPhone";
import React, {useState} from "react";
import {ErrorPhoneValid} from "@/components/ui/loginUI/errorModule/ErrorPhoneValid";
import {useAuthFormContext} from "@/context/AuthFormProvider";
import {usePhoneChange} from "@/hooks/phoneChange";

type ChangeType = "phone" | "email";

interface ChangeBasicAltInfoProps {
    type: ChangeType | null;
    onClose: () => void;
}

export const ChangeBasicAltInfo = ({type, onClose}:ChangeBasicAltInfoProps) => {
    const [inputValue, setInputValue] = useState("");
    const {phone, setPhone, setIsPhoneValid, inputPhoneRef} = useAuthFormContext();
    const { handlePhoneChange, handleKeyDown, isRussianPhoneValid } = usePhoneChange({
        phone,
        setPhone,
        setIsPhoneValid,
        inputPhoneRef
    });

    const handleChange = async () => {
        const value = type === "phone" ? phone : inputValue;
        if (!type || value.trim() === "") return;

        const result = await changeAltData(value.trim(), type);
        console.log("Результат изменения:", result);

        onClose();
    }

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
                handleChange();
            }}>
                <input
                    className={styles.changeInput}
                    type={type === "phone" ? "tel" : "email"}
                    value={type === "phone" ? phone : inputValue}
                    onChange={type === "phone" ? handlePhoneChange : (e) => setInputValue(e.target.value)}
                    placeholder={
                        type === "phone"
                            ? "+7 (XXX) XXX-XX-XX"
                            : "example@example.com"
                    }
                    onKeyDown={type === "phone" ? handleKeyDown : undefined}
                />
                <ErrorPhoneValid isPhoneValid={phone.replace(/\D/g, '').replace(/^7|8/, '').slice(0, 10).length === 10} isRussianPhoneValid={isRussianPhoneValid}/>
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