import styles from "@/styles/start/codeInput.module.css";
import {ErrorCodeSuccess} from "@/components/ui/loginUI/errorModule/ErrorCodeSuccess";
import React, {useEffect} from "react";
import {useCodeInput} from "@/components/ui/loginUI/CodeInput";
import {useAuthFormContext} from "@/context/AuthFormProvider";


export const CodeInput = () => {
    const {
        isVisible
    } = useAuthFormContext();

    const {
        handleInput,
        handleKeyDownCode,
        isCodeValid,
        isCodeSuccess,
        inputsRef,
        code,
        successTimer,
        setSuccessTimer
    } = useCodeInput();

    useEffect(() => {
        if (successTimer > 0) {
            const interval = setInterval(() => {
                setSuccessTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [successTimer, setSuccessTimer]);

    return (
        <div className={styles.codeSection}>
            <span className={styles.codeSectionLabel}>Поле для кода</span>
            <form
                action=""
                id="codeForm"
                className={styles.codeInputs + " " + (isCodeValid ? "" : styles.codeInputError)}
            >
                {[0, 1, 2, 3, 4, 5].map((index) => {
                    const hasValue = code[index] && code[index].trim() !== '';
                    const borderColor = isCodeSuccess
                        ? '#74ff69'
                        : hasValue
                            ? 'var(--graphBorder-primary)'
                            : '#151515';

                    return (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            onChange={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDownCode(e, index)}
                            readOnly={!isVisible}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="numeric"
                            value={code[index] || ''}
                            className={styles.codeInput}
                            style={{
                                border: `1px solid ${borderColor}`,
                                transition: 'border 0.3s ease',
                                opacity: !isVisible ? 0.5 : 1,
                            }}
                        />
                    );
                })}
                <ErrorCodeSuccess isCodeValid={isCodeValid}/>
            </form>
        </div>
    )
}