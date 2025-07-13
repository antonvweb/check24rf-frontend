'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';
import { CAPTCHA_SITE_KEY, CAPTCHA_VERIFY_URL } from "@/components/types/constants";
import styles from "@/styles/start/start.module.css";

export const ComponentWithCaptcha = ({ setIsCaptchaVerified }: { setIsCaptchaVerified: (b: boolean) => void }) => {

    const handleSuccess = async (token: string) => {
        console.debug("[CAPTCHA] Token received:", token);

        try {
            console.debug("[CAPTCHA] Пробую отправить запрос по адресу" + CAPTCHA_VERIFY_URL);
            const res = await fetch(CAPTCHA_VERIFY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            console.debug("[CAPTCHA] Verification request sent to backend");

            const data = await res.json();
            console.info("[CAPTCHA] Backend response:", data);

            setIsCaptchaVerified(data.success);
        } catch (e) {
            console.error("[CAPTCHA] Error verifying token with backend:", e);
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
