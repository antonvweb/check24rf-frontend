'use client'

import React, {useEffect, useState} from 'react';
import styles from '../../../styles/profile/profile.module.css';
import { ActiveChecks } from "@/components/ActiveChecks";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import { ArchiveChecks } from "@/components/ArchiveChecks";
import {Account} from "@/components/Account";
import {Notifications} from "@/components/Notifications";
import {Support} from "@/components/Support";
import { withAuthProtection } from "@/hoc/withAuthProtection";
import { ThemeProvider } from '@/context/ThemeContext';
import {useImageLoader} from "@/hooks/start/useImageLoader";
import {initializeTheme} from "@/utils/theme";
import Preloader from "@/components/Preloader";
import { AuthFormProvider } from '@/context/AuthFormProvider';

function Profile() {
    const [activeTab, setActiveTab] = useState('checks');
    const isLoading = useImageLoader();

    useEffect(() => {
        initializeTheme();
    }, []);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) setActiveTab(hash);
    }, []);

    useEffect(() => {
        const onHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) setActiveTab(hash);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    if (isLoading) return <Preloader />;

    return (
        <AuthFormProvider>
            <ThemeProvider>
                <div className={styles.profile}>
                    <div className={styles.content}>
                        <main className={styles.main}>
                            <div className={styles.leftBox}>
                                <Logo/>
                                <main>
                                    <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                                    <div className={styles.reklama} style={{display: activeTab === 'account' ? 'none' : 'block'}}/>
                                </main>
                            </div>
                            {activeTab === 'checks' && <ActiveChecks />}
                            {activeTab === 'archive' && <ArchiveChecks />}
                            {activeTab === 'account' && <Account />}
                            {activeTab === 'notif' && <Notifications />}
                            {activeTab === 'support' && <Support />}
                        </main>
                    </div>
                </div>
            </ThemeProvider>
        </AuthFormProvider>
    );
}

export default withAuthProtection(Profile);
