import Link from 'next/link';
import Logo from "@/components/Logo";
import styles from "@/styles/start/start.module.css";
import React from "react";

export default function NotFound() {
    return (
        <div className="notFound">
            <div className={styles.backgroundImg}/>
            <main className={"mainNotFound"}>
                <div className="notFoundlogo">
                    <Logo/>
                </div>
                <div className="centerNotFound">
                    <div className="notFoundTitle">
                        <span>404</span>
                        <span>Страница которую вы ищите не существует</span>
                    </div>
                    <Link href="/start" className={"backCite"}>Вернуться на главную</Link>
                </div>
            </main>
        </div>
    );
}
