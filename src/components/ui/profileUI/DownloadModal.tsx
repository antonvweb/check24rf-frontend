import styles from '@/styles/profile/checkList/downloadModal.module.css'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {useState} from "react";
import {Box} from "@mui/system";

interface PayModelProps {
    isVisible: boolean;
    close: () => void;
}

export const DownloadModal = ({ close ,isVisible }: PayModelProps) => {
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentChange = (event: SelectChangeEvent) => {
        setPaymentMethod(event.target.value);
    };

    if (!isVisible) return null;

    return (
        <div
            className={styles.downloadModal}
            onClick={e => e.stopPropagation()}
        >
            <div className={styles.functional}>
                <div className={styles.downloadList}>
                    <span>Способ оплаты</span>
                    <FormControl fullWidth size="medium">
                        <InputLabel id="download-method-label"
                            sx={{
                                color: 'var(--font-primary)',
                            }}
                        >Выберите способ</InputLabel>
                        <Select
                            labelId="download-method-label"
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
                            <MenuItem value="email">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        px: 1,
                                        py: 1
                                    }}
                                >
                                    <span>Почта</span>
                                </Box>
                            </MenuItem>

                            <MenuItem value="tg">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        px: 1,
                                        py: 1
                                    }}
                                >
                                    <span>Телеграмм</span>
                                </Box>
                            </MenuItem>

                        </Select>
                    </FormControl>
                </div>
                <div className={styles.mailForTheCheck}>
                    <span>Почта</span>
                    <input type="email" placeholder={"Введите почту"}/>
                </div>
                <div className={styles.btns}>
                    <button type={"button"} className={styles.addArchiveBtn} onClick={close}>Добавить в архив</button>
                    <button type={"button"} className={styles.downloadBtn} onClick={close}>Скачать</button>
                </div>
            </div>
        </div>
    );
};
