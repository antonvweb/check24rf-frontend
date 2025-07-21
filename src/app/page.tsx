'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";

const isMobileDevice = (): boolean => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile) {
    return (
        <div className="wrapper">
          <div className="dev-container">
            <main className={"main-dev-container"}>
              <div className="logo">
                <Image src={"./logo.svg"} alt={"Логотип Чек24.рф"} width={81} height={95}/>
                <div className="title">
                  <h1>ЧЕК24.РФ</h1>
                  <p>цифровая платформа</p>
                </div>
              </div>
              <div className="dev-mode">
                <span>Этот сервис предназначен для использования на компьютере.</span>
                <span> Пожалуйста, откройте сайт на ПК или ноутбуке для полноценного доступа к функционалу.</span>
              </div>
            </main>
            <footer className="footer-dev-container">
              <p>Возможно мобильная версия появится позже</p>
            </footer>
          </div>
        </div>
    );
  }

  return (
      <div className="wrapper">
        <div className="dev-container">
          <main className={"main-dev-container"}>
            <div className="logo">
              <Image src={"./logo.svg"} alt={"Логотип Чек24.рф"} width={81} height={95} priority/>
              <div className="title">
                <h1>ЧЕК24.РФ</h1>
                <p>цифровая платформа</p>
              </div>
            </div>
            <div className="dev-mode">
              <h1>Сайт находится в <br/> разработке.</h1>
            </div>
          </main>
          <footer className="footer-dev-container">
            <p>&copy; ЧЕК24.РФ - зарегистрированная торговая марка ООО &#34;ГИП&#34;. 2024-2025</p>
          </footer>
        </div>
        <picture className="bg-img">
          <img src={"/000.png"} alt={"Задний фон"}/>
        </picture>
      </div>
  );
}
