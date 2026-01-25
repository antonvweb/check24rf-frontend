import React, { useState } from "react";
import styles from "@/styles/start/agreementsSection.module.css";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { ComponentWithCaptcha } from "@/components/ui/loginUI/ComponentWithCaptcha";
import { PersonalDataModel } from "@/components/ui/loginUI/PersonalDataModel";
import { useAuth } from "@/context/contextAuth";

export const AgreementsSection = () => {
    const { agreedToTerms, setAgreedToTerms } = useAuth();
    const [isOpenPersonalData, setIsOpenPersonalData] = useState(false);

    return (
        <div className={styles.agreements}>
            <span className={styles.agreementsTitle}>Соглашения</span>
            <ComponentWithCaptcha />
            <div className={styles.userAgreementCaptcha}>
                <div className={styles.captchaTop}>
                    <CustomCheckbox
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        color="#EBEBEB"
                    />
                    <span className={styles.captchaText}>Я согласен</span>
                </div>
                <span className={styles.captchaDescription}>
                    Для использования сервиса в соответствии с Федеральным законом от 27.06.2006 №152-ФЗ
                    «О персональных данных» требуется получение вашего согласия на обработку{" "}
                    <button
                        type="button"
                        onClick={() => setIsOpenPersonalData(true)}
                        className={styles.captchaLink}
                    >
                        персональных данных
                    </button>
                </span>
            </div>
            {isOpenPersonalData && (
                <>
                    <div
                        className={styles.modalOverlay}
                        onClick={() => setIsOpenPersonalData(false)}
                    />
                    <PersonalDataModel onClose={() => setIsOpenPersonalData(false)} />
                </>
            )}
        </div>
    );
};