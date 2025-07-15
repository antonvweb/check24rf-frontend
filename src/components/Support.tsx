"use client";

import styles from "@/styles/profile/support/support.module.css";
import Reference from "@/components/Reference";
import ChangeTheme from "@/components/ChangeTheme";
import Image from "next/image";
import { Appeal } from "@/components/support/Appeal";
import { Message } from "@/components/support/Message";
import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
    from: "user" | "admin";
    text: string;
    time: string;
}

export const Support = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const getCurrentTime = (): string => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: ChatMessage = {
            from: "user",
            text: inputValue.trim(),
            time: getCurrentTime(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");

        // Автоответ через 500 мс
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    from: "admin",
                    text: "Это тестовое сообщение",
                    time: getCurrentTime(),
                },
            ]);
        }, 500);
    };

    return (
        <div className={styles.support}>
            <header className={styles.header}>
                <div className={styles.header__right}>
                    <Reference />
                    <ChangeTheme />
                </div>
            </header>

            <main className={styles.mainSupport}>
                <div className={styles.chatBox}>
                    <div className={styles.specialist}>
                        <div className={styles.avatar}>
                            <Image src="/avatar.png" alt="Аватар" width={34} height={34} />
                        </div>
                        <span><strong>Дмитрий Сергеевич</strong>, администратор</span>
                    </div>

                    <div className={styles.chat}>
                        <div className={styles.messages} ref={messagesContainerRef}>
                            {messages.map((msg, index) => (
                                <Message key={index} from={msg.from} text={msg.text} time={msg.time} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className={styles.sendMessage} onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Сообщение..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button type="submit">Отправить</button>
                        </form>
                    </div>
                </div>

                <div className={styles.appeals}>
                    <div className={styles.top}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
                            <path d="M1 14L8.5224 7.88775C8.76867 7.68765 8.76866 7.31173 8.52238 7.11164L0.999999 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Обращения</span>
                    </div>

                    <div className={styles.appealsList}>
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                        <Appeal id={0} topic={"Уведомления"} description={"У меня какие-то проблемы с уведомлениями"} />
                    </div>

                    <button type={"button"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 14V0.5" stroke="#2E374F" strokeWidth="2" strokeMiterlimit="3.99393"/>
                            <path d="M0.254883 7.24512L13.7549 7.24512" stroke="#2E374F" strokeWidth="2" strokeMiterlimit="3.99393"/>
                        </svg>
                        <span>Новое обращение</span>
                    </button>
                </div>
            </main>
        </div>
    );
};
