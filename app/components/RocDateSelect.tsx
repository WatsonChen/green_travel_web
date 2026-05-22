'use client';

import { useEffect, useState } from 'react';
import { Select, Space } from 'antd';
import dayjs from 'dayjs';

interface RocDateSelectProps {
  value?: dayjs.Dayjs | null;
  onChange?: (date: dayjs.Dayjs | null) => void;
}

const CURRENT_ROC_YEAR = dayjs().year() - 1911;

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} 月`,
}));

function getDaysInMonth(rocYear: number, month: number): number {
  return dayjs(`${rocYear + 1911}-${String(month).padStart(2, '0')}-01`).daysInMonth();
}

export default function RocDateSelect({ value, onChange }: RocDateSelectProps) {
  const [year, setYear] = useState<number | undefined>(
    value ? value.year() - 1911 : undefined
  );
  const [month, setMonth] = useState<number | undefined>(
    value ? value.month() + 1 : undefined
  );
  const [day, setDay] = useState<number | undefined>(
    value ? value.date() : undefined
  );

  // 外部 value 變更時同步（例如表單預填）
  useEffect(() => {
    if (value) {
      setYear(value.year() - 1911);
      setMonth(value.month() + 1);
      setDay(value.date());
    } else if (value === null) {
      setYear(undefined);
      setMonth(undefined);
      setDay(undefined);
    }
  }, [value]);

  const emit = (y: number | undefined, m: number | undefined, d: number | undefined) => {
    if (!y || !m || !d) return;
    const date = dayjs(`${y + 1911}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    onChange?.(date.isValid() ? date : null);
  };

  const maxDays = year && month ? getDaysInMonth(year, month) : 31;

  const yearOptions = Array.from({ length: CURRENT_ROC_YEAR }, (_, i) => {
    const y = CURRENT_ROC_YEAR - i;
    return { value: y, label: `民國 ${y} 年` };
  });

  const dayOptions = Array.from({ length: maxDays }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} 日`,
  }));

  const handleYearChange = (v: number) => {
    setYear(v);
    const safeDay = day && month && day > getDaysInMonth(v, month) ? undefined : day;
    if (safeDay !== day) setDay(safeDay);
    emit(v, month, safeDay);
  };

  const handleMonthChange = (v: number) => {
    setMonth(v);
    const safeDay = day && year && day > getDaysInMonth(year, v) ? undefined : day;
    if (safeDay !== day) setDay(safeDay);
    emit(year, v, safeDay);
  };

  const handleDayChange = (v: number) => {
    setDay(v);
    emit(year, month, v);
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Select
        placeholder="民國年"
        value={year}
        onChange={handleYearChange}
        options={yearOptions}
        style={{ flex: 2 }}
        showSearch
        filterOption={(input, option) => String(option?.value).includes(input)}
      />
      <Select
        placeholder="月"
        value={month}
        onChange={handleMonthChange}
        options={MONTH_OPTIONS}
        style={{ flex: 1 }}
      />
      <Select
        placeholder="日"
        value={day}
        onChange={handleDayChange}
        options={dayOptions}
        style={{ flex: 1 }}
      />
    </Space.Compact>
  );
}
