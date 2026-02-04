import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarProps {
  viewDate: Date;
  attendance: Record<string, 'full' | 'half' | 'absent'>;
  onChangeMonth: (offset: number) => void;
  onDayClick: (dateStr: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ viewDate, attendance, onChangeMonth, onDayClick }: CalendarProps) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const generateDays = () => {
    const days: (number | null)[] = [];

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getStatusClass = (status: 'full' | 'half' | 'absent' | undefined) => {
    switch (status) {
      case 'full':
        return 'calendar-day-full';
      case 'half':
        return 'calendar-day-half';
      case 'absent':
        return 'calendar-day-absent';
      default:
        return 'bg-muted/50 hover:bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border">
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onChangeMonth(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg md:text-xl font-bold text-foreground min-w-[140px] md:min-w-[180px] text-center">
            {MONTH_NAMES[month]} {year}
          </h2>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onChangeMonth(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Legend Pills */}
        <div className="flex gap-2 justify-center sm:justify-end">
          <span className="pill-full text-[0.65rem] font-semibold px-2.5 py-1 rounded-full uppercase">
            Full
          </span>
          <span className="pill-half text-[0.65rem] font-semibold px-2.5 py-1 rounded-full uppercase">
            Half
          </span>
          <span className="pill-absent text-[0.65rem] font-semibold px-2.5 py-1 rounded-full uppercase">
            Absent
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-3">
        {/* Day Headers */}
        {DAY_HEADERS.map(day => (
          <div
            key={day}
            className="text-center text-[0.65rem] md:text-xs font-semibold text-muted-foreground uppercase pb-2"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {generateDays().map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = getDateStr(day);
          const status = attendance[dateStr];

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200',
                'hover:-translate-y-0.5 active:scale-95',
                getStatusClass(status)
              )}
            >
              <span className="text-sm md:text-base font-medium">{day}</span>
              {status && (
                <span className="text-[0.5rem] md:text-[0.6rem] font-bold uppercase mt-0.5">
                  {status}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
