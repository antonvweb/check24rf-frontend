"use client"

import styles from "@/styles/admin/admin.module.css"
import React, {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {checkAuth} from "@/utils/checkAuth";
import Preloader from "@/components/Preloader";
import api from "@/lib/axios"

export default function AdminPage() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            const isAuth = await checkAuth();
            if (isAuth) {
                router.push("/admin/panel");
            } else {
                setIsLoading(false);
            }
        };
        verify();
    }, [router]);

    const handleLogin = async () => {
        try {
            const { data, status } = await api.post(
                "/api/auth/login",
                { login, password },
                { withCredentials: true }
            );

            if (status !== 200) {
                throw new Error("Ошибка авторизации")
            }

            localStorage.setItem("jwt", data.token)

            router.push("/admin/panel")
        } catch {
            setError("Неверный логин или пароль")
        }
    }

    if (isLoading) return <Preloader/>;

    return (<div className={styles.adminPanel}>
            <div className={styles.adminContainer}>
                <main className={styles.mainAdmin}>
                    <div className={styles.content}>
                        <p className={styles.title}>Вход</p>
                        <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder="Логин"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p style={{color: "var(--alert-error)", margin: "0"}}>{error}</p>}
                            <button
                                type="submit"
                                className={styles.submitButton}
                                onClick={handleLogin}
                            >
                                Войти
                            </button>
                        </form>
                    </div>
                </main>
                <footer className={styles.footerAdmin}>
                    <p>ЧЕК24.РФ АДМИН ПАНЕЛЬ</p>
                </footer>
            </div>
            <div className="bg-color"/>
            <picture className="bg-img">
                <img src={"/000.png"} alt={"Задний фон"}/>
            </picture>
        </div>)
}
