import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Filler,
    Chart, TooltipItem,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import React, { useRef } from 'react';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

export const BalanceChart: React.FC = () => {
    const chartRef = useRef<Chart<'line'> | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const labels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const dataValues = [
        500, 400, 450, 300, 380, 200, 210,
        250, 300, 310, 700, 900, 950, 953.03,
        953.03, 953.03, 900, 850, 750, 700, 6000,
        550, 500, 850, 900, 0, 0, 100, 500,
        800, 100,
    ];

    const data = {
        labels,
        datasets: [
            {
                label: 'Баланс',
                data: dataValues,
                fill: true,
                tension: 0.4,
                clip: false as const,
                backgroundColor: (ctx: { chart: ChartJS }) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, -250, 0, 300);
                    gradient.addColorStop(0, '#64D4F8');
                    gradient.addColorStop(.85, '#2E374F');
                    return gradient;
                },
                borderColor: '#64D4F8',
                pointBackgroundColor: '#ff6600',
                pointBorderColor: '#ff6600',
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBorderColor: '#ffffff',
                cursor: 'pointer',
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: '#fff' },
                grid: { display: false },
            },
            y: { display: false },
        },
        plugins: {
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#2E374F',
                bodyColor: '#2E374F',
                callbacks: {
                    label: (tooltipItem: TooltipItem<'line'>) => {
                        const value = tooltipItem.raw as number;
                        return `${value.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                        })}`;
                    },
                },
                displayColors: false,
                yAlign: 'bottom',
                caretPadding: 10,
            },
            legend: { display: false },
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 6,
                hoverBorderWidth: 2,
                borderColor: '#fff',
                backgroundColor: '#ff6600',
                hoverBackgroundColor: '#ff6600',
                hitRadius: 10,
            },
        },
        onHover: (event, activeElements) => {
            if (containerRef.current) {
                containerRef.current.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        },
    };

    return (
        <div
            ref={containerRef}
            style={{
                background: '#2E374F',
                borderRadius: '6px',
                padding: '10px',
                width: '100%',
                position: 'relative',
            }}

        >
            <div style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 400, opacity: .6, position: 'absolute',
                top: 10,
                left: 10,}}>Март 2025</div>
            <Line
                data={data}
                options={options}
                ref={chartRef}
                style={{ overflow: 'visible', width: '100%', height: '100%' }}
            />
        </div>
    );
};