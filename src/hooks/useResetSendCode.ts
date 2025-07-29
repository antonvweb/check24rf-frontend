import {useEffect} from "react";
import {useTimer} from "@/hooks/useTimer";
import {useAuthFormContext} from "@/context/AuthFormProvider";


export const useResetSendCode = () => {
    const { seconds, reset} = useTimer(10);
    const {resetSendCode}  = useAuthFormContext();

    useEffect(() => {
        if (seconds === 0) {
            resetSendCode();
            reset();
        }
    }, [reset, resetSendCode, seconds]);
}