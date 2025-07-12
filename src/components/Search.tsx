import React, { useState } from 'react';
import styles from '../styles/profile/checkList/search.module.css';

export default function Search() {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Жёстко заданные данные для примера
    const suggestions = {
        seller: ['Яндекс.Такси', 'ООО “ЯНДЕКС.ТАКСИ”'],
        inn: '7704340310',
        buyer: '+7 (993) 477-07-90',
    };

    // Обработчик изменения input
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);

        // Показываем подсказки, если введено слово "Яндекс" (регистр не важен)
        if (value.toLowerCase().includes('яндекс')) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }

    return (
        <div className={styles.search}>
            <div className={styles.searchGlass}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                    <circle cx="8.6087" cy="8.6087" r="7.8587" stroke="#2E374F" strokeWidth="1.5"/>
                    <path d="M14.3478 14.3478L22.9565 22" stroke="#2E374F" strokeWidth="1.5" strokeLinecap="round"/>
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
                <div className={styles.overWrapper}
                >
                    <div className={styles.overItem}>
                        <strong>Продавец:</strong><br />
                        <div>
                            <span>{suggestions.seller[0]}</span><br />
                            <span>{suggestions.seller[1]}</span>
                        </div>
                        </div>
                    <div className={styles.overItem}>
                        <strong>ИНН:</strong><br />
                        <span>{suggestions.inn}</span>
                    </div>
                    <div className={styles.overItem}>
                        <strong>Покупатель:</strong><br />
                        <span>{suggestions.buyer}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
