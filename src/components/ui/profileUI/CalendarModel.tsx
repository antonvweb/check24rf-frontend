import { useState } from 'react';
import styles from '../../../styles/profile/checkList/calendarModel.module.css';
import { motion } from 'framer-motion';

const MONTHS = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const getDaysInMonth = (year: number, month: number): (Date | null)[] => {
    const firstDay = new Date(year, month, 1);
    const days: (Date | null)[] = [];

    // Сдвиг, чтобы неделя начиналась с Пн (понедельник = 0)
    const shift = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < shift; i++) days.push(null);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }
    return days;
};

export const CalendarModel = () => {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [yearStart, setYearStart] = useState(today.getFullYear());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);


    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
        setStartDate(null);
        setEndDate(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
        setStartDate(null);
        setEndDate(null);
    };

    const onDateClick = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (date > startDate) {
                setEndDate(date);
            } else {
                setStartDate(date);
            }
        }
    };

    const isInRange = (date: Date) => {
        if (!startDate) return false;
        if (startDate && !endDate) return date.getTime() === startDate.getTime();
        return date >= startDate && date <= endDate!;
    };

    const isStart = (date: Date) => startDate && date.getTime() === startDate.getTime();
    const isEnd = (date: Date) => endDate && date.getTime() === endDate.getTime();

    const handlePrevYears = () => setYearStart(y => y + 1);
    const handleNextYears = () => setYearStart(y => y - 1);

    const days = getDaysInMonth(currentYear, currentMonth);
    const years = Array.from({ length: 6 }, (_, i) => yearStart - i);

    return (
        <div className={styles.CalendarModel}>
            <div className={styles.left}>
                <div className={styles.topMoth}>
                    <button onClick={handlePrevMonth}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path d="M7.06201 1L1.46753 5.61451C1.22506 5.8145 1.22507 6.18597 1.46755 6.38596L7.06201 11" stroke="#2E374F" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <span>{MONTHS[currentMonth]}</span>
                    <button onClick={handleNextMonth}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ transform: 'rotate(180deg)' }}>
                            <path d="M7.06201 1L1.46753 5.61451C1.22506 5.8145 1.22507 6.18597 1.46755 6.38596L7.06201 11" stroke="#2E374F" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.date}>
                    <div className={styles.top}>
                        {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className={styles.main}>
                        {days.map((d, i) => {
                            if (!d) return <div key={i} className={styles.emptyDay} />;

                            const start = isStart(d);
                            const end = isEnd(d);
                            const inRange = isInRange(d) && !start && !end;

                            const dayClass = [
                                styles.day,
                                start ? styles.daySelected : '',
                                end ? styles.daySelected : '',
                                inRange ? styles.inRange : '',
                            ].join(' ');

                            return (
                                <motion.button
                                    key={i}
                                    type="button"
                                    className={dayClass}
                                    onClick={() => onDateClick(d)}
                                    layoutId={start || end ? 'selectedDay' : undefined} // анимация для крайних дат
                                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                >
                                    {d.getDate()}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <button onClick={handlePrevYears}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none" style={{transform: 'rotate(180deg)' }}>
                        <path d="M1 1L5.61451 6.59448C5.8145 6.83695 6.18597 6.83694 6.38596 6.59446L11 1" stroke="#F0F3F6" strokeLinecap="round"/>
                    </svg>
                </button>
                {years.map(y => (
                    <div
                        key={y}
                        className={`${styles.yearItem} ${y === currentYear ? styles.yearActive : ''}`}
                        onClick={() => {
                            setCurrentYear(y);
                        }}
                    >
                        {y}
                    </div>
                ))}
                <button onClick={handleNextYears}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1L5.61451 6.59448C5.8145 6.83695 6.18597 6.83694 6.38596 6.59446L11 1" stroke="#F0F3F6" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};
