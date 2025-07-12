import styles from '../../../styles/profile/checkList/payModel.module.css'
import { Receipt } from "@/components/types/interfaces";
import {CustomCheckbox} from "@/components/ui/CustomCheckbox";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {useState} from "react";
import {Box} from "@mui/system";

interface PayModelProps {
    items: Receipt[];
    isVisible: boolean;
}

export const PayModel = ({ items, isVisible }: PayModelProps) => {
    const [checked, setChecked] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentChange = (event: SelectChangeEvent) => {
        setPaymentMethod(event.target.value);
    };

    if (!isVisible) return null;

    const handleChange = (value: boolean) => {
        setChecked(value);
    };

    return (
        <div
            className={styles.payModel}
            onClick={e => e.stopPropagation()}
        >
            <div className={styles.payCheckList}>
                {items.map((r, i) => (
                    <div key={i} className={styles.item}>
                        <span className={styles.buyer}>{r.date}</span>
                        <div className={styles.salesManData}>
                            <span className={styles.salesman}>{r.salesman}</span>
                            <span className={styles.ooo}>{r.ooo}</span>
                        </div>
                        <span className={styles.price}>{r.price.toFixed(2)} Руб.</span>
                    </div>
                ))}
            </div>
            <div className={styles.functional}>
               <div className={styles.resultPayment}>
                   <span>Сумма выбранных чеков</span>
                   <span>{items.length * 12} ₽</span>
               </div>
                <div className={styles.paymentList}>
                    <span>Способ оплаты</span>
                    <FormControl fullWidth size="medium">
                        <InputLabel id="payment-method-label">Выберите способ</InputLabel>
                        <Select
                            labelId="payment-method-label"
                            value={paymentMethod}
                            onChange={handlePaymentChange}
                            label="Выберите способ"
                            sx={{
                                height: '54px',
                                borderRadius: '6px',
                                border: '1px solid #2E374F',
                                backgroundColor: '#FFF',
                                paddingLeft: '15px',
                                fontSize: '1.125rem',
                                color: '#2E374F',
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
                                        border: '1px solid #2E374F',
                                        backgroundColor: '#FFF',
                                        overflow: 'hidden'
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
                <div className={styles.agreementsPayment}>
                    <div className={styles.top}>
                        <CustomCheckbox
                            checked={checked}
                            onChange={(e) => handleChange(e.target.checked)}
                        />
                        <span>Соглашение</span>
                    </div>
                    <span className={styles.description}>Бла блабла бла блаблабла блабла бла бла бла бла бла</span>
                </div>
                <button type={"button"} className={styles.buyBtn}>Оплатить</button>
            </div>
        </div>
    );
};
