import React, { useState } from 'react';
import styles from '@/styles/profile/checkList/search.module.css';


export default function Search() {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [closeSuggestions, setCloseSuggestions] = useState(false);

    const suggestions = [
        {
            seller: ['Яндекс.Такси', 'ООО “ЯНДЕКС.ТАКСИ”'],
            inn:'7704340310',
            buyer:'+7 (993) 477-07-90',
            data:'05.04.2025, 16:46'
        },
        {
            seller: ['Wildberries', 'ООО “ВАЙЛДБЕРРИЗ”'],
            inn:'7721546864',
            buyer:'+7 (993) 477-07-90',
            data:'01.01.2025, 12:31'
        },
        {
            seller: ['Золушка', 'ООО “ЗОЛУШКА”'],
            inn:'5012083360',
            buyer:'+7 (993) 477-07-90',
            data:'12.03.2024, 01:46'
        }
    ];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);

        if (value !== "") {
            setCloseSuggestions(false);
            setShowSuggestions(true);
        } else {
            setCloseSuggestions(true);

            setTimeout(() => {
                setShowSuggestions(false);
                setCloseSuggestions(false);
            }, 400);
        }
    }



    return (
        <div className={styles.search}>
            <div className={styles.searchGlass}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                    <circle cx="8.6087" cy="8.6087" r="7.8587" strokeWidth="1.5"/>
                    <path d="M14.3478 14.3478L22.9565 22" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>
            <input
                type="text"
                placeholder="Поиск"
                id="search"
                className="search-input"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                value={query}
                onChange={handleChange}
            />

            {showSuggestions && (
                <div className={`${styles.overWrapper} ${closeSuggestions ? styles.close : styles.open}`}>
                {suggestions.map((item, i) => (
                        <div key={i} className={styles.overItem}>
                            <div>
                                <span>{item.seller[0]}</span><br />
                                <span>{item.seller[1]}</span>
                            </div>
                            <span>{item.data}</span>
                            <span>{item.inn}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
