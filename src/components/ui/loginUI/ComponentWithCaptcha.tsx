'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';
import { CAPTCHA_SITE_KEY } from "@/components/types/constants";
import styles from "@/styles/start/start.module.css";
import {useAuth} from "@/context/contextAuth";

export const ComponentWithCaptcha = () => {
    const {verifyCaptcha} = useAuth();

    return (
        <div className={styles.YandexCaptchaWrapper}>
            <SmartCaptcha
                sitekey={CAPTCHA_SITE_KEY}
                onSuccess={verifyCaptcha}
            />
        </div>
    );
};
