import React, { useRef, useEffect } from "react";
import styles from "@/styles/start/codeInput.module.css";
import { ErrorCodeSuccess } from "@/components/ui/loginUI/errorModule/ErrorCodeSuccess";
import { useAuth } from "@/context/contextAuth";

export const CodeInput = () => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const { code, setCode, codeSent, verifyCode } = useAuth();

    const [isCodeValid, setIsCodeValid] = React.useState(true);
    const [isCodeSuccess, setIsCodeSuccess] = React.useState(false);

    // ============================================================================
    // Автофокус на первом инпуте при открытии формы
    // ============================================================================

    useEffect(() => {
        if (codeSent && inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, [codeSent]);

    // ============================================================================
    // Автоматическая верификация при заполнении всех 6 цифр
    // ============================================================================

    useEffect(() => {
        const codeString = code.join("");
        if (codeString.length === 6) {
            (async () => {
                const success = await verifyCode();
                if (success) {
                    setIsCodeSuccess(true);
                    setIsCodeValid(true);
                } else {
                    setIsCodeValid(false);
                }
            })();
        }
    }, [code, verifyCode]);

    // ============================================================================
    // Обработка ввода
    // ============================================================================

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Разрешаем только цифры
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Берём последний введённый символ
        setCode(newCode);

        // Переход на следующий инпут
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // ============================================================================
    // Обработка клавиш (Backspace, Delete, Arrow keys)
    // ============================================================================

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newCode = [...code];
            if (newCode[index]) {
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
                newCode[index - 1] = "";
                setCode(newCode);
            }
        } else if (e.key === "Delete") {
            e.preventDefault();
            const newCode = [...code];
            newCode[index] = "";
            setCode(newCode);
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // ============================================================================
    // Render
    // ============================================================================

    return (
        <div className={styles.codeSection}>
            <span className={styles.codeSectionLabel}>Поле для кода</span>
            <form
                id="codeForm"
                className={`${styles.codeInputs} ${!isCodeValid ? styles.codeInputError : ""}`}
            >
                {[0, 1, 2, 3, 4, 5].map((index) => {
                    const hasValue = code[index] && code[index].trim() !== "";
                    const borderColor = isCodeSuccess
                        ? "#74ff69"
                        : hasValue
                            ? "var(--graphBorder-primary)"
                            : "#151515";

                    return (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            onChange={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            readOnly={!codeSent}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="numeric"
                            value={code[index] || ""}
                            className={styles.codeInput}
                            style={{
                                border: `1px solid ${borderColor}`,
                                transition: "border 0.3s ease",
                                opacity: !codeSent ? 0.5 : 1,
                            }}
                        />
                    );
                })}
                <ErrorCodeSuccess isCodeValid={isCodeValid} />
            </form>
        </div>
    );
};