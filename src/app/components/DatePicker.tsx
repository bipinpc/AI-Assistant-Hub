import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  primaryColor?: string;
  label?: string;
  minDate?: string; // YYYY-MM-DD format
  maxDate?: string; // YYYY-MM-DD format
  disablePastDates?: boolean;
  timezone?: string; // e.g., "ET", "PT"
}

export function DatePicker({
  value,
  onChange,
  primaryColor = '#3b82f6',
  label = 'Select date',
  minDate,
  maxDate,
  disablePastDates = true,
  timezone,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(value || null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculate min date (today if disablePastDates is true)
  const effectiveMinDate = disablePastDates 
    ? (minDate && minDate > getTodayString() ? minDate : getTodayString())
    : minDate;

  // Format date for display (e.g., "March 18, 2026")
  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString + 'T12:00:00'); // Add time to avoid timezone issues
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format date for display with timezone (e.g., "March 18, 2026 (ET)")
  const formatDisplayDateWithTimezone = (dateString: string): string => {
    const formatted = formatDisplayDate(dateString);
    return timezone ? `${formatted} (${timezone})` : formatted;
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Check if date is disabled
  const isDateDisabled = (day: number): boolean => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (effectiveMinDate && dateString < effectiveMinDate) return true;
    if (maxDate && dateString > maxDate) return true;

    return false;
  };

  // Check if date is selected
  const isDateSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString === selectedDate;
  };

  // Check if date is today
  const isToday = (day: number): boolean => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString === getTodayString();
  };

  // Handle date selection
  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setSelectedDate(dateString);
    onChange(dateString);
    
    // Close calendar immediately after selection
    setIsOpen(false);
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Get month/year display
  const getMonthYearDisplay = () => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in-0 zoom-in-95 rounded-lg border-2 bg-white p-4 shadow-lg" style={{ borderColor: primaryColor }}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Calendar className="h-4 w-4" style={{ color: primaryColor }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{label}</div>
            {selectedDate && (
              <div className="text-xs text-gray-500">
                {formatDisplayDateWithTimezone(selectedDate)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="mb-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          className="h-8 w-8 p-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="font-semibold text-gray-900">{getMonthYearDisplay()}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="h-8 w-8 p-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-9" />;
            }

            const disabled = isDateDisabled(day);
            const selected = isDateSelected(day);
            const today = isToday(day);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={disabled}
                className={cn(
                  'flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-all',
                  disabled && 'cursor-not-allowed text-gray-300 line-through',
                  !disabled && !selected && 'hover:bg-gray-100 text-gray-700',
                  !disabled && !selected && today && 'border border-gray-300 font-semibold',
                  selected && 'text-white shadow-md',
                )}
                style={selected ? { backgroundColor: primaryColor } : undefined}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with helpful text */}
      <div className="mt-4 flex items-start gap-2 rounded-md bg-gray-50 p-2">
        <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-600">
          {disablePastDates ? 'Past dates are disabled. ' : ''}
          {timezone && `Times shown in ${timezone}. `}
          Select a date from the calendar above.
        </p>
      </div>

      {/* Display Format Note */}
      <div className="mt-3 border-t pt-3">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Date Format:</span> MM/DD/YYYY internally
        </div>
        {selectedDate && (
          <div className="mt-1 text-xs font-semibold" style={{ color: primaryColor }}>
            Selected: {formatDisplayDate(selectedDate)}
          </div>
        )}
      </div>
    </div>
  );
}