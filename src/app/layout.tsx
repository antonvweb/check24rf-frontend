import type {Metadata} from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
    title: "Сайт в разработке",
    description: "Сайт в разработке",
    viewport: "width=device-width, initial-scale=1",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/shortcut-icon.png",
        apple: "/apple-touch-icon.png",
    },

};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>){
    return (
        <html lang="ru">
            <body>
                {children}
            </body>
        </html>
    );
}
