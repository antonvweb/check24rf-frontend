"use client"

import { checkAuth } from "@/utils/checkAuth";
import styles from "@/styles/admin/panel.module.css"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation";
import {NavigationAdminPanel} from "@/components/admin/panel/NavigationAdminPanel";
import { MainPanel } from "@/components/admin/panel/MainPanel";
import {MetricsPanel} from "@/components/admin/panel/MetricsPanel";
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
    sub: string
    role: string
    iat: number
    exp: number
}

export default function PanelPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('main');
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token || token.split('.').length !== 3) return;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            setUserName(decoded.sub);
        } catch (err) {
            console.error('Ошибка декодирования JWT:', err);
        }
    }, []);

    useEffect(() => {
        async function verify() {
            const isAuth = await checkAuth();
            if (!isAuth) router.push("/admin");
        }

        verify();
    }, [router]);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) setActiveTab(hash);
    }, []);


    return (
        <div className={styles.adminPanel}>
            <main className={styles.mainAdminPanel}>
                <div className={styles.leftBox}>
                    <span className={styles.username}>{userName}</span>
                    <div className={styles.nav}>
                        <NavigationAdminPanel activeTab={activeTab} setActiveTab={setActiveTab}/>
                    </div>
                </div>
                {activeTab === 'main' && <MainPanel />}
                {activeTab === 'metrics' && <MetricsPanel />}
            </main>
        </div>
    )
}