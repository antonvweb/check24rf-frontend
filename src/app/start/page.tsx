"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/start/start.module.css";
import { AuthForm } from "@/components/start/AuthForm";
import { CodeInput } from "@/components/start/CodeInput";
import { AgreementsSection } from "@/components/start/AgreementSection";
import { TechSupport } from "@/components/start/TechSupport";
import { initializeTheme } from "@/utils/theme";
import { withAuthProtection } from "@/hoc/withAuthProtection";

function StartPage() {
    useEffect(() => {
        initializeTheme();
    }, []);

    return (
        <main className={styles.mainStart}>
            <picture className="bg-img">
                <img src="/000.png" alt="Задний фон" />
            </picture>
            <div className={styles.gradientOverlay} />
            <div className={styles.mainContent}>
                <div className={styles.startLeftBox}>
                    <div className={styles.logoServices}>
                        <div className={styles.logoCheckRf}>
                            <Image
                                className={styles.logoCheckRfIcon}
                                src="/logo.svg"
                                alt="Логотип ЧЕК24.РФ"
                                width={81}
                                height={95}
                            />
                            <div className={styles.logoTitle}>
                                <span className={styles.logoTitleMain}>ЧЕК24.РФ</span>
                                <span className={styles.logoTitleSubtitle}>цифровая платформа</span>
                            </div>
                        </div>
                        <Image
                            className={styles.fnsLogo}
                            src="/fnsLogo.svg"
                            alt="Логотип ФНС"
                            width={298}
                            height={79}
                        />
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
                            <AgreementsSection />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Start() {
    return (
        <StartPage />
    );
}

export default withAuthProtection(Start);