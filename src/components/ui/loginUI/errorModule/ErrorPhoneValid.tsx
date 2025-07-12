import styles from "@/styles/start/error.module.css";
import React from "react";

interface ErrorPhoneValidProps {
    isPhoneValid: boolean;
    isRussianPhoneValid: boolean | null;
}

export const ErrorPhoneValid = ({isPhoneValid, isRussianPhoneValid} :ErrorPhoneValidProps) => {
    return(
        isPhoneValid && !isRussianPhoneValid && (
            <div className={styles.errorWrapperPhone}>
                <svg
                    viewBox="0 0 329 55"
                    preserveAspectRatio="none"
                    className={styles.errorBackgroundPhone}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g filter="url(#filter0_d_329_1631)">
                        <path d="M4 6.00256C4 2.68785 6.68785 0.00114221 10.0025 0.0025508L312.416 0.131062C315.728 0.13247 318.413 2.81835 318.413 6.13106V13.9379C318.413 16.4323 320.019 18.607 322.037 20.0733C322.73 20.577 323.413 21.1709 323.974 21.8491C324.805 22.8545 324.862 24.2838 324.184 25.3983C323.568 26.4121 322.764 27.2501 321.952 27.9218C320.03 29.5123 318.413 31.6985 318.413 34.1929V40.9975C318.413 44.3122 315.725 46.9989 312.411 46.9974L9.99744 46.8689C6.68473 46.8675 4 44.1816 4 40.8689V6.00256Z" fill="#F0F3F6"/>
                    </g>
                    <defs>
                        <filter id="filter0_d_329_1631" x="0" y="0.00255036" width="328.649" height="54.9949" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4"/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_329_1631"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_329_1631" result="shape"/>
                        </filter>
                    </defs>
                </svg>

                <div className={styles.errorContent}>
                    <div className={styles.errorIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
                            <ellipse cx="13.5" cy="14" rx="3.5" ry="8" fill="white"/>
                            <path d="M14.5946 0.972616C14.4338 0.677041 14.2019 0.43147 13.9223 0.260698C13.6428 0.0899261 13.3255 0 13.0024 0C12.6794 0 12.3621 0.0899261 12.0825 0.260698C11.8029 0.43147 11.571 0.677041 11.4102 0.972616L0.269546 20.9712C-0.472948 22.3047 0.417395 24 1.86177 24H24.1415C25.5858 24 26.4778 22.303 25.7337 20.9712L14.5946 0.972616ZM12.9992 6.85888C13.8684 6.85888 14.5491 7.6508 14.4614 8.56442L13.8928 14.5758C13.8737 14.812 13.7712 15.032 13.6058 15.1923C13.4403 15.3526 13.2238 15.4415 12.9992 15.4415C12.7745 15.4415 12.558 15.3526 12.3926 15.1923C12.2271 15.032 12.1247 14.812 12.1056 14.5758L11.5369 8.56442C11.5165 8.34884 11.5391 8.13114 11.6033 7.92534C11.6675 7.71954 11.7718 7.53021 11.9096 7.36953C12.0473 7.20886 12.2154 7.08041 12.4031 6.99245C12.5908 6.9045 12.7938 6.859 12.9992 6.85888ZM13.0024 17.1436C13.4333 17.1436 13.8466 17.3241 14.1513 17.6456C14.456 17.9671 14.6271 18.4031 14.6271 18.8577C14.6271 19.3123 14.456 19.7483 14.1513 20.0697C13.8466 20.3912 13.4333 20.5718 13.0024 20.5718C12.5715 20.5718 12.1583 20.3912 11.8536 20.0697C11.5489 19.7483 11.3777 19.3123 11.3777 18.8577C11.3777 18.4031 11.5489 17.9671 11.8536 17.6456C12.1583 17.3241 12.5715 17.1436 13.0024 17.1436Z" fill="#F54447"/>
                        </svg>

                    </div>
                    <span className={styles.errorText}>Неверный номер телефона</span>
                </div>
            </div>
        )
    )
}