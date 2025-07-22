"use client"

import styles from "@/styles/admin/metricsPanel.module.css"
import api from "@/lib/axios"
import {useEffect, useState} from "react";

type MonitorData = {
    cpu: number;
    memory: {
        used: number;
        total: number;
    };
    dbStatus: string;
    backendStatus: string;
    logs: string[];
};

const fetchMonitorData = async (): Promise<MonitorData | null> => {
    try {
        const response = await api.get("/api/monitor");
        console.log(response);
        return response.data;
    } catch (e) {
        console.error("Ошибка мониторинга:", e);
        return null;
    }
};

export const MetricsPanel = () => {
    const [data, setData] = useState<MonitorData | null>(null);
    const delay = 3000;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMonitorData();
                setData(data);
            } catch (error) {
                console.error("Ошибка мониторинга:", error);
            }
        };

        fetchData(); // первая загрузка сразу
        const interval = setInterval(fetchData, delay); // каждые 5 секунд

        return () => clearInterval(interval); // очистка при размонтировании
    }, []);


    if (!data) return <p>Загрузка...</p>;

    return (
        <div className={styles.metricsPanel}>
            <h2>Мониторинг сервера</h2>
            <p><b>CPU:</b> {data.cpu}%</p>
            <p><b>RAM:</b> {data.memory.used} MB / {data.memory.total} MB</p>
            <p><b>Бэкенд:</b> {data.backendStatus}</p>
            <p><b>База данных:</b> {data.dbStatus}</p>
            <h3>Последние логи:</h3>
            <pre>{data.logs?.join('\n') ?? 'Нет логов'}</pre>
        </div>
    );
}