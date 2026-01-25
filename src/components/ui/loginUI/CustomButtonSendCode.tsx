import Button from "@mui/material/Button";
import React from "react";
import {useAuth} from "@/context/contextAuth";

export const CustomButtonSendCode = () => {
    const {
        codeSent,
        isPhoneValid,
        agreedToTerms,
        seconds
    } = useAuth();

    const { captchaToken } = useAuth();

    const isDisabled = !isPhoneValid || !agreedToTerms || (captchaToken === null) || codeSent;

    return (
        <Button
            type="submit"
            disabled={isDisabled}
            sx={{
                width: '35%',
                borderRadius: '6px',
                background: isDisabled ? '#d3d3d3' : '#A7DFF1',
                backdropFilter: 'blur(18px)',
                border: 'none',
                outline: 'none',
                fontSize: '1.3rem',
                fontWeight: 400,
                lineHeight: 'normal',
                textTransform: 'none',
                color: '#000',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                '&:hover': {
                    background: isDisabled ? '#d3d3d3' : '#8fc9db',
                }
            }}
        >
            {codeSent ? seconds : 'Отправить код'}
        </Button>
    );
};