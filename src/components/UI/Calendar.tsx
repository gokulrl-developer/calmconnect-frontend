import { useState } from "react";
import { motion } from "framer-motion";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import type { ReactElement } from "react";

interface CalendarProps {
  initialDate?: Date | string;
  onDateSelect?: (date: Date) => void;
  showWeekdaysShort?: boolean;
}

export default function Calendar({
  initialDate = new Date(),
  onDateSelect = () => {},
  showWeekdaysShort = true,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    typeof initialDate === "string" ? parseISO(initialDate) : initialDate
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const header = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <button
          aria-label="previous month"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ‹
        </button>
        <div className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          aria-label="next month"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ›
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const start = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const days: ReactElement[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      days.push(
        <div key={i} className="text-xs font-medium text-center">
          {showWeekdaysShort ? format(d, "EEE") : format(d, "EEEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-2 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows: ReactElement[] = [];
    let days: ReactElement[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day); 
        const inMonth = isSameMonth(cloneDay, monthStart);
        const selected = selectedDate && isSameDay(cloneDay, selectedDate);

        days.push(
          <div key={cloneDay.toISOString()} className="p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDate(new Date(cloneDay.getTime())); 
  onDateSelect(new Date(cloneDay.getTime()));  
              }}
              className={`w-max h-max rounded-lg p-2 text-left transition-shadow focus:outline-none
            ${inMonth ? "" : "opacity-40"}
            ${
              selected
                ? "ring-2 ring-indigo-400 dark:ring-indigo-600"
                : "hover:shadow-lg"
            }`}
            >
              <div className="text-sm font-medium">{format(cloneDay, "d")}</div>
            </motion.button>
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-2 my-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
      {header()}
      {renderDays()}
      {renderCells()}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <strong className="mr-2">Selected:</strong>
        {selectedDate ? format(selectedDate, "PPP") : "None"}
      </div>
    </div>
  );
}
