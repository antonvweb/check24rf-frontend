'use client'

import {useEffect, useState} from 'react';
import styles from '../../styles/profile/profile.module.css';
import { ActiveChecks } from "@/components/ActiveChecks";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import { ArchiveChecks } from "@/components/ArchiveChecks";
import {Account} from "@/components/Account";
import {Notifications} from "@/components/Notifications";
import {Support} from "@/components/Support";
import { withAuthProtection } from "@/hoc/withAuthProtection";

function Profile() {
    const [activeTab, setActiveTab] = useState('checks');

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

    return (
        <div className={styles.content}>
            <main className={styles.main}>
                <div className={styles.leftBox}>
                    <Logo/>
                    <main>
                        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                        <div className={styles.reklama}/>
                    </main>
                </div>
                {activeTab === 'checks' && <ActiveChecks />}
                {activeTab === 'archive' && <ArchiveChecks />}
                {activeTab === 'account' && <Account />}
                {activeTab === 'notif' && <Notifications />}
                {activeTab === 'support' && <Support />}
            </main>
        </div>
    );
}

export default withAuthProtection(Profile);
