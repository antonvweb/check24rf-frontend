import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/contextAuth";
import { UserProvider } from "@/context/UserContext";
import {McoProvider} from "@/context/McoContext";

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
            <body>
                <AuthProvider>
                    <McoProvider>
                        <UserProvider>
                            {children}
                        </UserProvider>
                    </McoProvider>
                </AuthProvider>
            </body>
        </html>
    );
}