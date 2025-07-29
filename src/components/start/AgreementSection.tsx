import styles from "@/styles/start/agreementsSection.module.css";
import {CustomCheckbox} from "@/components/ui/CustomCheckbox";
import { ComponentWithCaptcha } from "@/components/ui/loginUI/ComponentWithCaptcha";
import {PersonalDataModel} from "@/components/ui/loginUI/PersonalDataModel";
import React from "react";
import {useAuthFormContext} from "@/context/AuthFormProvider";

export const AgreementsSection = () => {
    const {
        checked,
        handleCheckboxChange,
        isOpenPersonalData,
        openPersonalDataModal,
        closePersonalDataModal
    } = useAuthFormContext();

    return (
        <div className={styles.agreements}>
            <span className={styles.agreementsTitle}>Соглашения</span>
            <ComponentWithCaptcha/>
            <div className={styles.userAgreementCaptcha}>
                <div className={styles.captchaTop}>
                    <CustomCheckbox
                        checked={checked}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        color={"#EBEBEB"}
                    />
                    <span className={styles.captchaText}>Я согласен</span>
                </div>
                <span className={styles.captchaDescription}>Для использования сервиса в соответствии с Федеральным законом от 27.06.2006 №152-ФЗ «О персональных данных». требуется получение вашего согласия на обработку <button type={"button"} onClick={openPersonalDataModal} className={styles.captchaLink}>персональных данных</button> </span>
            </div>
            {isOpenPersonalData && (
                <>
                    <div className={styles.modalOverlay} onClick={closePersonalDataModal} />
                    <PersonalDataModel onClose={closePersonalDataModal} />
                </>
            )}
        </div>
    )
}