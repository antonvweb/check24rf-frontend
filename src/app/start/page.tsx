    "use client";

    import React, { useState, useRef, FormEvent, useEffect } from "react";
    import Image from "next/image";
    import { useRouter } from "next/navigation";
    import { ComponentWithCaptcha } from "@/components/ui/loginUI/ComponentWithCaptcha";
    import styles from "@/styles/start/start.module.css";
    import {CustomCheckbox} from "@/components/ui/CustomCheckbox";
    import {CustomButtonSendCode} from "@/components/ui/loginUI/CustomButtonSendCode"
    import { ChatBox } from '@/components/techSupport/ChatBox';
    import PhoneInput from "@/components/ui/loginUI/PhoneInput";
    import { useTimer } from "@/hooks/useTimer";
    import {useCodeInput} from "@/components/ui/loginUI/CodeInput";
    import {TEST_CODE} from "@/components/types/constants";
    import {ErrorCodeSuccess} from "@/components/ui/loginUI/errorModule/ErrorCodeSuccess";
    import Preloader from "@/components/Preloader";
    import {PersonalDataModel} from "@/components/ui/loginUI/PersonalDataModel";

    function isLoggedInValid() {
        if (typeof window === "undefined") return false;

        const data = localStorage.getItem("isLoggedIn");
        if (!data) return false;

        try {
            const parsed = JSON.parse(data);
            return parsed.value && parsed.expiresAt > Date.now();
        } catch {
            return false;
        }
    }

    export default function Start() {
        const [phone, setPhone] = useState('');
        const [isPhoneValid, setIsPhoneValid] = useState(false);
        const [isVisible, setIsVisible] = useState(false);
        const [sendCode, setSendCode] = useState(false);
        const router = useRouter();
        const [checked, setChecked] = useState(false);
        const [isChatVisible, setIsChatVisible] = useState(false);
        const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
        const inputPhoneRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
        const [isLoading, setIsLoading] = useState(true);
        const [isOpenPersonalData, setIsOpenPersonalData] = useState(false);
        const [shouldRender, setShouldRender] = useState(false);

        const { seconds, start, reset} = useTimer(10);
        const {  handleInput,
            handleKeyDownCode,
            isCodeValid,
            isCodeSuccess,
            successTimer,
            inputsRef,
            code,
            setSuccessTimer} = useCodeInput();

        useEffect(() => {
            const checkAuth = () => {
                if (typeof window === "undefined") return;

                if (isLoggedInValid()) {
                    router.replace('/profile');
                } else {
                    setShouldRender(true);
                }
            };

            if (document.readyState === "complete") {
                checkAuth();
            } else {
                window.addEventListener("load", checkAuth);
            }

            return () => window.removeEventListener("load", checkAuth);
        }, [router]);

        useEffect(() => {
            const handlePageLoad = () => {
                setIsLoading(false);
            };

            if (document.readyState === "complete") {
                setIsLoading(false);
            } else {
                window.addEventListener("load", handlePageLoad);
            }

            return () => {
                window.removeEventListener("load", handlePageLoad);
            };
        }, []);

        const toggleChat = () => {
            setIsChatVisible(prev => !prev);
        };
        const openOpenPersonalData   = () => setIsOpenPersonalData(true);
        const closeOpenPersonalData  = () => setIsOpenPersonalData(false);

        const handleChange = (value: boolean) => {
            setChecked(value);
        };

        const handleFormPhoneSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!isPhoneValid || !checked || !isCaptchaVerified || sendCode) return;

            setSendCode(true);
            setIsVisible(true);
            localStorage.setItem('code', TEST_CODE);
            start();
            console.log('Отправка формы', phone);
        };

        useEffect(() => {
            const goToProfile = async () => {
                await router.prefetch('/profile');
                router.push('/profile');
            };

            if (successTimer === 0 && isCodeSuccess) {
                const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // +24 часа
                localStorage.setItem("isLoggedIn", JSON.stringify({ value: true, expiresAt }));
                goToProfile();
            }

            if (successTimer > 0) {
                const interval = setInterval(() => {
                    setSuccessTimer(prev => prev - 1);
                }, 1000);
                return () => clearInterval(interval);
            }
        }, [successTimer, isCodeSuccess, router, setSuccessTimer]);

        useEffect(() => {
            if (seconds === 0) {
                setSendCode(false)
                reset();
            }
        }, [reset, seconds]);

        if (isLoading || !shouldRender) return <Preloader />;

        return (
        <main className={styles.mainStart}>
              <div className={styles.backgroundImg}/>
              <div className={styles.gradientOverlay}/>
              <div className={styles.mainContent}>
                  <div className={styles.startLeftBox}>
                      <div className={styles.logoServices}>
                          <div className={styles.logoCheckRf}>
                              <Image className={styles.logoCheckRfIcon} src={"/logo.svg"} alt={"Логотип Чек24.рф"} width={81} height={95}/>
                              <div className={styles.logoTitle}>
                                  <span className={styles.logoTitleMain}>ЧЕК24.РФ</span>
                                  <span className={styles.logoTitleSubtitle}>цифровая платформа</span>
                              </div>
                          </div>
                          <Image className={styles.fnsLogo} src={"/fnsLogo.svg"} alt={"Логотип ФНС"} width={298} height={79}/>
                      </div>
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
                      </div>
                      <ChatBox isVisible={isChatVisible} />
                  </div>
                  <div className={styles.formWrapper}>
                      <div className={styles.startRightBox}>
                          <div className={styles.registerModal}>
                              <div>
                                  <span className={styles.loginTitle}>Вход по номеру телефона</span>
                                  <div className={styles.numberPhone}>
                                      <span className={styles.numberPhoneLabel}>Номер телефона</span>
                                      <form onSubmit={handleFormPhoneSubmit} className={styles.numberPhoneForm}>
                                          <PhoneInput phone={phone} setPhone={setPhone} inputRef={inputPhoneRef} setIsPhoneValid={setIsPhoneValid} />
                                          <CustomButtonSendCode sendCode={sendCode} timer={seconds} checked={checked} isPhoneValid={isPhoneValid} isCaptchaVerified={isCaptchaVerified} />
                                      </form>
                                  </div>
                                  <div className={styles.codeSection}>
                                      <span className={styles.codeSectionLabel}>Поле для кода</span>
                                      <form
                                          action=""
                                          id="codeForm"
                                          className={styles.codeInputs + " " + (isCodeValid ? "" : styles.codeInputError)}
                                      >
                                          {[0, 1, 2, 3, 4, 5].map((index) => (
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
                                                      border: isCodeSuccess
                                                          ? '1px solid #74ff69'
                                                          : `1px solid ${isCodeValid ? '#151515' : '#ff4141'}`,
                                                      transition: 'border 0.3s ease',
                                                      opacity: !isVisible ? 0.5 : 1,
                                                  }}
                                              />
                                          ))}
                                      </form>
                                      <ErrorCodeSuccess isCodeValid={isCodeValid}/>
                                  </div>
                              </div>
                              <div className={styles.agreements}>
                                  <span className={styles.agreementsTitle}>Соглашения</span>
                                 <ComponentWithCaptcha setIsCaptchaVerified={setIsCaptchaVerified} />
                                  <div className={styles.userAgreementCaptcha}>
                                      <div className={styles.captchaTop}>
                                          <CustomCheckbox
                                              checked={checked}
                                              onChange={(e) => handleChange(e.target.checked)}
                                              color={"#EBEBEB"}
                                          />
                                          <span className={styles.captchaText}>Я согласен</span>
                                      </div>
                                      <span className={styles.captchaDescription}>Для использования сервиса в соответствии с Федеральным законом от 27.06.2006 №152-ФЗ «О персональных данных». требуется получение вашего согласия на обработку <button type={"button"} onClick={openOpenPersonalData} className={styles.captchaLink}>персональных данных</button> </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            {isOpenPersonalData && (
                <>
                    <div className={styles.modalOverlay} onClick={closeOpenPersonalData} />
                    <PersonalDataModel onClose={closeOpenPersonalData} />
                </>
            )}
        </main>
        );
    }