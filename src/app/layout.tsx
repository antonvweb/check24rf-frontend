// app/layout.tsx или app/layout.js
import "./globals.css";
import React from "react";

export const metadata = {
    title: "Сайт в разработке",
    description: "Сайт в разработке",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/shortcut-icon.png",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
            />
            <title>Чек24.рф</title>
        </head>
        <body>{children}</body>
        </html>
    );
}
