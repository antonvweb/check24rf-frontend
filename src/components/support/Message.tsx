import styles from "@/styles/profile/support/support.module.css";
import Image from "next/image";

interface MessageProps {
    from: "user" | "admin";
    text: string;
    time: string;
}

export const Message = ({ from, text, time }: MessageProps) => {
    const isUser = from === "user";

    return (
        <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.admin}`}>
            {!isUser && (
                <div className={styles.avatar}>
                    <Image src="/avatar.png" alt="Аватар" width={34} height={34} />
                </div>
            )}
            <div className={styles.messageBubble}>
                <p className={styles.text}>{text}</p>
                <span className={styles.time}>{time}</span>
            </div>
        </div>
    );
};
