'use client'

import { useState, useRef } from 'react';
import styles from '../styles/profile/checkList/reference.module.css';

export default function Reference() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        const button = buttonRef.current;
        if (!button) return;

        let currentWidth  = parseInt(button.style.width  || '48', 10);
        let currentHeight = parseInt(button.style.height || '48', 10);

        const minWidth  = 48;
        const maxWidth  = 173;
        const minHeight = 48;
        const maxHeight = 72;

        const step = 8;
        const fps  = 16;

        if (!isExpanded) {
            const interval = setInterval(() => {
                currentWidth  = Math.min(currentWidth  + step, maxWidth);
                currentHeight = Math.min(currentHeight + step * (maxHeight - minHeight) / (maxWidth - minWidth), maxHeight);

                button.style.width  = `${currentWidth}px`;
                button.style.height = `${currentHeight}px`;

                if (currentWidth >= maxWidth) {
                    clearInterval(interval);
                    setShowLinks(true);
                }
            }, fps);

            setIsExpanded(true);
        }
        else {
            setShowLinks(false);
            const interval = setInterval(() => {
                currentWidth  = Math.max(currentWidth  - step, minWidth);
                currentHeight = Math.max(currentHeight - step * (maxHeight - minHeight) / (maxWidth - minWidth), minHeight);

                button.style.width  = `${currentWidth}px`;
                button.style.height = `${currentHeight}px`;

                if (currentWidth <= minWidth) {
                    clearInterval(interval);
                    setIsExpanded(false);
                }
            }, fps);
        }
    };

    return (
        <button
            ref={buttonRef}
            className={styles.reference}
            type="button"
            onClick={handleClick}
            style={{ width: '50px', height: '50px' }}
        >
            {showLinks && (
                <div className={styles.dropLinks}>
                    <a href="#">О проекте</a>
                    <a href="#">Контакты</a>
                </div>
            )}
            <div style={{marginBottom: 'auto', marginTop: '10px'}}>
                <div className={styles.circle}><span>?</span></div>
            </div>
        </button>
    );
};
