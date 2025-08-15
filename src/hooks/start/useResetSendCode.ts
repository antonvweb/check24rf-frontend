import {useEffect} from "react";
import {useAuthFormContext} from "@/context/AuthFormProvider";

export const useResetSendCode = () => {
    const {resetSendCode, seconds, resetTimer}  = useAuthFormContext();

    useEffect(() => {
        if (seconds === 0) {
            resetSendCode();
            resetTimer();
        }
    }, [resetTimer, resetSendCode, seconds]);
}