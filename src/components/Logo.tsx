import Image from "next/image"
import styles from '@/styles/profile/logo.module.css';

export default function Logo () {
    return (
        <div className={styles.logo}>
            <Image src={"./logo.svg"} alt={"Логотип"} width={52} height={60.089}></Image>
            <div className={styles.left}>
                <span>ЧЕК24.РФ </span>
                <span>цифровая платформа</span>
            </div>
        </div>
    )
}