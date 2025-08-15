import { useState, useEffect, useRef } from "react";

export function useTimer(initialSeconds: number) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        console.log('⏱ Таймер стартует');
        if (intervalRef.current !== null) {
            console.log('⏹ Уже запущен — return');
            return;
        }

        intervalRef.current = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const reset = (newSeconds: number = initialSeconds) => {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSeconds(newSeconds);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return { seconds, start, reset };
}
