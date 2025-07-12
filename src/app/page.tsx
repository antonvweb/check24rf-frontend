'use client';

import React, { useEffect, useState } from 'react';
import styles from "@/styles/start/start.module.css";
import Image from "next/image";

const isMobileDevice = (): boolean => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile === null) {
    // Пока не определился тип устройства — можно показывать загрузку
    return <div>Загрузка...</div>;
  }

  if (isMobile) {
    return (
        <div className="wrapper">
          <div className="dev-container">
            <div className="logo">
              <Image className={styles.logoCheckRfIcon} src={"/logo.svg"} alt={"Логотип Чек24.рф"} width={81} height={95}/>
              <div className="title">
                <h1>ЧЕК24.РФ</h1>
                <p>цифровая платформа</p>
              </div>
            </div>
            <div className="dev-mode">
              <h3>Приносим свои извинения но мобильной версии нет. Пожалуйста, перейдите на Desktop версию для корректной работы сервиса</h3>
            </div>
          </div>
        </div>
    );
  }


  return (
      <div className="wrapper">
        <div className="dev-container">
          <div className="logo">
            <Image className={styles.logoCheckRfIcon} src={"/logo.svg"} alt={"Логотип Чек24.рф"} width={81} height={95}/>
            <div className="title">
              <h1>ЧЕК24.РФ</h1>
              <p>цифровая платформа</p>
            </div>
          </div>
          <div className="dev-mode">
            <h1>Сайт находится в <br/> разработке.</h1>
          </div>
        </div>
      </div>
  );
}
