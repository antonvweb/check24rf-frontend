'use client';

import React, {useRef} from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import styles from '@/styles/profile/account/account.module.css';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { useTheme } from '@/context/ThemeContext';

export const BalanceChart: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { theme } = useTheme();

    const colorAxisPointer = theme === 'dark' ? '#27324A' : '#64D4F8';
    const gradientFirst = theme === 'dark' ? '#27324A' : '#64D4F8';
    const gradientSecond = theme === 'dark' ? '#111111' : '#27324A';

    const labels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const dataValues = [
        500, 400, 450, 300, 380, 200, 210,
        250, 300, 310, 700, 900, 950, 953.03,
        953.03, 953.03, 900, 850, 750, 700, 6000,
        550, 500, 850, 900, 0, 0, 100, 500,
        800, 100,
    ];

    const option: echarts.EChartsOption = {
        grid: {
            top: 20,
            bottom: 20,
            left: 0 ,
            right: 20,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'var(--graphTooltip-bg-primary)',
            borderColor: 'var(--graphBorder-primary)',
            borderWidth: 1,
            textStyle: {
                color: 'var(--graph-font-primary)',
            },
            formatter: (params: CallbackDataParams[] | CallbackDataParams) => {
                const point = Array.isArray(params) ? params[0] : params;
                const val = point.data;

                return `<strong>${Number(val).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                })}</strong>`;
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: colorAxisPointer,
                },
            },
        },
        xAxis: {
            type: 'category',
            data: labels,
            boundaryGap: false,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: '#fff',
            },
        },
        yAxis: {
            type: 'value',
            show: false,
        },
        series: [
            {
                name: 'Баланс',
                type: 'line',
                data: dataValues,
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                animationDelay: function(idx) {
                    return idx * 100 + 100;
                },
                animationEasing: 'cubicInOut',
                lineStyle: {
                    color: colorAxisPointer,
                    width: 2,
                },
                itemStyle: {
                    color: '#ff6600',
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: gradientFirst },
                        { offset: 0.85, color: gradientSecond },
                    ]),
                },
            },
        ],
    };


    return (
        <div ref={containerRef} className={styles.graphModal}>
            <span className={styles.dateGraph}>Март 2025</span>
            <ReactECharts
                option={option}
                notMerge={true}
                lazyUpdate={true}
                style={{ width: '100%', height: '100%' }}
                onEvents={{
                    mouseover: () => {
                        if (containerRef.current) containerRef.current.style.cursor = 'pointer';
                    },
                    mouseout: () => {
                        if (containerRef.current) containerRef.current.style.cursor = 'default';
                    },
                }}
            />
        </div>
    );
};
