import styles from '@/styles/profile/checkList/payModel.module.css'
import {Receipt, userPaySubscribe} from "@/components/types/interfaces";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {useState} from "react";
import {Box} from "@mui/system";

interface PayModelProps {
    type: "checks" | "subscribe";
    items?: Receipt[];               // для чеков
    subscription?: userPaySubscribe; // для подписки (отдельный пропс)
    isVisible: boolean;
}


export const PayModel = ({ type, items, subscription, isVisible }: PayModelProps) => {
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentChange = (event: SelectChangeEvent) => {
        setPaymentMethod(event.target.value);
    };

    if (!isVisible) return null;
    return (
        <div
            className={styles.payModel}
            onClick={e => e.stopPropagation()}
        >
            <div className={styles.payCheckList}>
                {type === "checks" ?
                    (
                        items?.map((r, i) => (
                            <div key={i} className={styles.item}>
                                <span className={styles.buyer}>{r.date}</span>
                                <div className={styles.salesManData}>
                                    <span className={styles.salesman}>{r.salesman}</span>
                                    <span className={styles.ooo}>{r.ooo}</span>
                                </div>
                                <span className={styles.price}>{r.price.toFixed(2)} Руб.</span>
                            </div>
                        ))
                    )
                :
                    (
                        <div className={styles.item}>
                            <span className={styles.salesman}>{subscription?.monthPeriod}</span>
                        </div>
                    )
                }
            </div>
            <div className={styles.functional}>
                <div className={styles.resultPayment}>
                    {type === "checks" && Array.isArray(items) ? (
                        <>
                            <span>Сумма выбранных чеков</span>
                            <span>{items.reduce((acc, r) => acc + r.price, 0).toFixed(2)} ₽</span>
                        </>
                    ) : !Array.isArray(items) && type === "subscribe" ? (
                        <>
                            <span>Сумма: </span>
                        </>
                    ) : null}
                </div>
                <div className={styles.paymentList}>
                    <span>Способ оплаты</span>
                    <FormControl fullWidth size="medium">
                        <InputLabel id="payment-method-label"
                                    sx={{
                                        color: 'var(--font-primary)',
                                    }}
                        >Выберите способ</InputLabel>
                        <Select
                            labelId="payment-method-label"
                            value={paymentMethod}
                            onChange={handlePaymentChange}
                            label="Выберите способ"
                            sx={{
                                height: '54px',
                                borderRadius: '6px',
                                border: '1px solid var(--bg-quaternary)',
                                backgroundColor: 'var(--bg-secondary)',
                                paddingLeft: '15px',
                                fontSize: '1.125rem',
                                color: 'var(--font-primary)',
                                fontWeight: 400,
                                '& .MuiSelect-select': {
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                '& fieldset': {
                                    border: 'none',
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        mt: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--bg-quaternary)',
                                        backgroundColor: 'var(--bg-secondary)',
                                        overflow: 'hidden',
                                        color: "var(--font-primary)"
                                    },
                                },
                            }}
                        >
                            <MenuItem value="sbp">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        px: 1,
                                        py: 1
                                    }}
                                >
                                    <span>СБП (Система быстрых платежей)</span>
                                    <span>19 Руб.</span>
                                </Box>
                            </MenuItem>

                            <MenuItem value="yookassa">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        px: 1,
                                        py: 1
                                    }}
                                >
                                    <span>ЮKassa (YooMoney)</span>
                                    <span>25 Руб.</span>
                                </Box>
                            </MenuItem>

                        </Select>
                    </FormControl>
                </div>


                <div className={styles.mailForTheCheck}>
                    <span>Почта для чека</span>
                    <input type="email" placeholder={"Введите почту"}/>
                </div>
                <div className={styles.btns}>
                    {type === "checks" && Array.isArray(items) ? (
                        <>
                            <button type={"button"} className={styles.addArchiveBtn}>Добавить в архив</button>
                            <button type={"button"} className={styles.downloadBtn}>Скачать</button>
                        </>
                    ) : !Array.isArray(items) && type === "subscribe" ? (
                        <>
                            <button type={"button"} className={styles.downloadBtn}>Оплатить</button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
