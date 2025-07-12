import type { Metadata } from "next";
import React from "react";
import styles from "@/styles/profile/profile.module.css";

export const metadata: Metadata = {
    title: "чек24.рф",
    description: "Сайт чек24.рф",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/shortcut-icon.png",
        apple: "/apple-touch-icon.png",
    },
};

export function generateViewport() {
    return {
        width: "device-width",
        initialScale: 1,
    };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className={styles.profile}>
            {children}
        </main>
    );
}

