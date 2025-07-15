'use client';

import React, { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import styles from '@/styles/profile/account/account.module.css';

export const BalanceChart: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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
            backgroundColor: '#fff',
            borderColor: '#64D4F8',
            borderWidth: 1,
            textStyle: {
                color: '#2E374F',
            },
            formatter: (params: any) => {
                const val = params[0]?.data;
                return `<strong>${Number(val).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                })}</strong>`;
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#64D4F8',
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
                symbolSize: 6,
                showSymbol: false,
                lineStyle: {
                    color: '#64D4F8',
                    width: 2,
                },
                itemStyle: {
                    color: '#ff6600',
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#64D4F8' },
                        { offset: 0.85, color: '#2E374F' },
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
