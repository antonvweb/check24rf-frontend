"use client";

import React from "react";
import styles from "../styles/preloader.module.css";

export default function Preloader() {
    return (
        <div className={styles.loader}>
            <div className={styles.preloaderWrapper}>
                <svg
                    className={styles.staticCircle}
                    viewBox="0 0 50 50"
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="dropshadow" height="130%">
                            <feDropShadow
                                dx="0"
                                dy="1.5"
                                stdDeviation=".5"
                                floodColor="rgba(0,0,0,0.25)"
                            />
                        </filter>
                    </defs>
                    <circle
                        className={styles.track}
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="3"
                        filter="url(#dropshadow)"
                    />
                </svg>
                <svg
                    className={styles.spinner}
                    viewBox="0 0 50 50"
                    aria-hidden="true"
                >
                    <circle
                        className={styles.path}
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="3"
                    />
                </svg>
            </div>
        </div>
    );
}
