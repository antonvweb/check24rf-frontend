// ChatBox.tsx
import styles from '../../styles/techSupport/ChatBox.module.css';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

type Message = { from: 'user' | 'specialist'; text: string };
interface ChatBoxProps {
    isVisible: boolean;
    isOpen: boolean;
    isClosing: boolean;
}

export const ChatBox = ({ isVisible, isOpen, isClosing } :ChatBoxProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // автоскролл к последнему сообщению
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [
            ...prev,
            { from: 'user', text: inputValue },
            { from: 'specialist', text: 'Это тестовое сообщение' },
        ]);
        setInputValue('');
    };

    const boxClass = `
        ${styles.chatBox}
        ${isOpen ? styles.open : ''}
        ${isClosing ? styles.close : ''}
    `.trim();

    return (
        <div
            className={boxClass}
            style={{ display: isVisible ? 'flex' : 'none' }}   /* только прячем */
        >
            <div className={styles.top}>
                <Image src="/avatar.png" alt="Аватар" width={34} height={34} className={styles.avatar} />
                <span className={styles.specialistName}>Дмитрий Сергеевич, Администратор</span>
            </div>

            <div className={styles.chat}>
                <div className={styles.messageBox}>
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`${styles.message} ${
                                m.from === 'user' ? styles.userMessage : styles.specialistMessage
                            }`}
                        >
                            {m.text}
                        </div>
                    ))}
                    <div ref={bottomRef} />    {/* якорь для автоскролла */}
                </div>

                <form className={styles.sendMessage} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Сообщение..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button type="submit">Отправить</button>
                </form>
            </div>
        </div>
    );
};
