import {useCallback, useState} from "react";

export const useChatToggle = () => {
    const [showChat, setShowChat] = useState(false);
    const [closeChat, setCloseChat] = useState(false);

    const toggleChat = useCallback(() => {
        if (showChat) {
            setCloseChat(true);
            setTimeout(() => {
                setShowChat(false);
                setCloseChat(false);
            }, 400);
        } else {
            setShowChat(true);
            setCloseChat(false);
        }
    }, [showChat]);

    return { showChat, closeChat, toggleChat };
};