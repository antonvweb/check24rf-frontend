import Button from "@mui/material/Button";
import React from "react";

interface CustomButtonSendCodeProps {
    sendCode: boolean;
    isPhoneValid: boolean;
    checked: boolean;
    isCaptchaVerified: boolean;
    timer: number;
}

export const CustomButtonSendCode = ({sendCode, isPhoneValid, checked, isCaptchaVerified, timer}:CustomButtonSendCodeProps ) => {
    return (
        <Button
            type="submit"
            sx={{
                width: '35%',
                borderRadius: '6px',
                background: (isPhoneValid && checked && isCaptchaVerified && !sendCode)
                    ? '#A7DFF1'
                    : '#d3d3d3',
                backdropFilter: 'blur(18px)',
                border: 'none',
                outline: 'none',
                fontSize: '1.146vw',
                fontWeight: 400,
                lineHeight: 'normal',
                textTransform: 'none',
                color: '#000',
                cursor: (isPhoneValid && checked && isCaptchaVerified && !sendCode)
                    ? 'pointer'
                    : 'not-allowed',
            }}
        >
            {sendCode ? timer : 'Отправить код'}
        </Button>
    )
}