import styles from "@/styles/profile/account/account.module.css";
import {BasicInformation} from "@/components/account/BasicInformation";
import {Subscribe} from "@/components/account/Subscription";

export const InfoUser = () => {
    return(
        <section className={styles.infoSection}>
            <BasicInformation />
            <Subscribe/>
        </section>
    )
}