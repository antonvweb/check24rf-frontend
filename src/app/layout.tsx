import "./globals.css";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ЧЕК24.РФ",
    description: "Сайт в разработке",
    icons: {
        icon: "/favicon.ico"
    }
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
