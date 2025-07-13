'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';
import { CAPTCHA_SITE_KEY, CAPTCHA_VERIFY_URL } from "@/components/types/constants";
import styles from "@/styles/start/start.module.css";

export const ComponentWithCaptcha = ({ setIsCaptchaVerified }: { setIsCaptchaVerified: (b: boolean) => void }) => {

    const handleSuccess = async (token: string) => {
        try {
            const res = await fetch("http://217.199.252.124:8080/verify", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            setIsCaptchaVerified(data.success);
        } catch (e) {
            console.error(e);
            setIsCaptchaVerified(false);
        }
    };

    return (
        <div className={styles.YandexCaptchaWrapper}>
            <SmartCaptcha
                sitekey={CAPTCHA_SITE_KEY}
                onSuccess={handleSuccess}
            />
        </div>
    );
};
