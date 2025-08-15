"use client";

import React, {useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/start/start.module.css";
import Preloader from "@/components/Preloader";
import { AuthForm } from "@/components/start/AuthForm";
import { CodeInput } from "@/components/start/CodeInput";
import { AgreementsSection } from "@/components/start/AgreementSection";
import { TechSupport } from "@/components/start/TechSupport";
import { initializeTheme } from "@/utils/theme";
import { useImageLoader } from "@/hooks/start/useImageLoader";
import {AuthFormProvider} from "@/context/AuthFormProvider";
import {useUserStatus} from "@/hooks/start/useUserStatus";

export default function Start() {
    const isLoading = useImageLoader();
    const { checkUserActive } = useUserStatus();

    useEffect(() => {
        initializeTheme();
    }, []);

    useEffect(() => {
        checkUserActive();
    }, [checkUserActive]);

    if (isLoading) return <Preloader />;

    return (
        <AuthFormProvider>
            <main className={styles.mainStart}>
                <picture className="bg-img">
                    <img src={"/000.png"} alt={"Задний фон"}/>
                </picture>
                <div className={styles.gradientOverlay}/>
                <div className={styles.mainContent}>
                    <div className={styles.startLeftBox}>
                        <div className={styles.logoServices}>
                            <div className={styles.logoCheckRf}>
                                <Image className={styles.logoCheckRfIcon} src={"/logo.svg"} alt={"Логотип Чек24.рф"} width={81} height={95}/>
                                <div className={styles.logoTitle}>
                                    <span className={styles.logoTitleMain}>ЧЕК24.РФ</span>
                                    <span className={styles.logoTitleSubtitle}>цифровая платформа</span>
                                </div>
                            </div>
                            <Image className={styles.fnsLogo} src={"/fnsLogo.svg"} alt={"Логотип ФНС"} width={298} height={79}/>
                        </div>
                        <TechSupport />
                    </div>
                    <div className={styles.formWrapper}>
                        <div className={styles.startRightBox}>
                            <div className={styles.registerModal}>
                                <div>
                                    <AuthForm />
                                    <CodeInput />
                                </div>
                                <AgreementsSection/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthFormProvider>
    );
}