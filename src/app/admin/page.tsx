"use client"

import styles from "@/styles/admin/admin.module.css"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import {checkAuth} from "@/utils/checkAuth";
import Preloader from "@/components/Preloader";

export default function AdminPage() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
            const response = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login, password }),
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Ошибка авторизации")
            }

            const data = await response.json()
            localStorage.setItem("jwt", data.token)

            // ✅ Перенаправление после успешного входа
            router.push("/admin/panel")
        } catch {
            setError("Неверный логин или пароль")
        }
    }

    if(isLoading) return <Preloader />;

    return (
        <div className={styles.adminPanel}>
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
                            {error && <p style={{color: "red", margin: "0"}}>{error}</p>}
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
        </div>
    )
}
