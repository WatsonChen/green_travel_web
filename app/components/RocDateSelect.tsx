'use client';

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
  const rocYear = value ? value.year() - 1911 : undefined;
  const month = value ? value.month() + 1 : undefined;
  const day = value ? value.date() : undefined;

  const maxDays = rocYear && month ? getDaysInMonth(rocYear, month) : 31;

  const yearOptions = Array.from({ length: CURRENT_ROC_YEAR }, (_, i) => {
    const y = CURRENT_ROC_YEAR - i;
    return { value: y, label: `民國 ${y} 年` };
  });

  const dayOptions = Array.from({ length: maxDays }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} 日`,
  }));

  const emit = (y?: number, m?: number, d?: number) => {
    if (!y || !m || !d) { onChange?.(null); return; }
    const date = dayjs(`${y + 1911}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    onChange?.(date.isValid() ? date : null);
  };

  const safeDay = day && maxDays && day > maxDays ? undefined : day;

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Select
        placeholder="民國年"
        value={rocYear}
        onChange={(v) => emit(v, month, safeDay)}
        options={yearOptions}
        style={{ flex: 2 }}
        showSearch
        filterOption={(input, option) => String(option?.value).includes(input)}
      />
      <Select
        placeholder="月"
        value={month}
        onChange={(v) => emit(rocYear, v, safeDay)}
        options={MONTH_OPTIONS}
        style={{ flex: 1 }}
      />
      <Select
        placeholder="日"
        value={safeDay}
        onChange={(v) => emit(rocYear, month, v)}
        options={dayOptions}
        style={{ flex: 1 }}
      />
    </Space.Compact>
  );
}
