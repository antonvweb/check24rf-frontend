// app/layout.tsx
import "./globals.css";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Чек24.рф",
    description: "Сайт в разработке",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body>{children}</body>
        </html>
    );
}
