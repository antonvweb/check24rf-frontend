import styles from "@/styles/start/techSupport.module.css";
import {ChatBox} from "@/components/techSupport/ChatBox";
import React from "react";
import {useChatToggle} from "@/hooks/start/useChatToggle";


export const TechSupport = () => {
    const { showChat, closeChat, toggleChat} = useChatToggle();

    return (
        <div className={styles.techSupport}>
            <button type={"button"} onClick={toggleChat} className={styles.techSupportButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" viewBox="0 0 32 31" fill="none">
                    <path d="M17.9189 23.4907L11.492 27.9739C9.66271 29.2499 7.15385 27.941 7.15385 25.7107C7.15385 24.1867 5.9184 22.9512 4.39441 22.9512H4C2.34315 22.9512 1 21.6081 1 19.9512V4C1 2.34315 2.34315 1 4 1H28C29.6569 1 31 2.34314 31 4V19.9512C31 21.6081 29.6569 22.9512 28 22.9512H19.6353C19.0214 22.9512 18.4224 23.1395 17.9189 23.4907Z" stroke="#2E374F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="12" r="2" fill="#2E374F"/>
                    <circle cx="16" cy="12" r="2" fill="#2E374F"/>
                    <circle cx="25" cy="12" r="2" fill="#2E374F"/>
                </svg>
            </button>
            <p className={styles.techSupportText}>Техническая поддержка</p>
            <ChatBox isVisible={showChat} isOpen={showChat} isClosing={closeChat} />
        </div>
    )
}