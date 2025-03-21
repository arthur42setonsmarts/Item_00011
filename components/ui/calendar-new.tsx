"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | { from: Date; to: Date }
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  month?: Date
  onMonthChange?: (date: Date) => void
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  initialFocus?: boolean
}

export function CalendarNew({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  month: propMonth,
  onMonthChange,
  weekStartsOn = 0,
  initialFocus = false,
}: CalendarProps) {
  const [month, setMonth] = React.useState(() => propMonth || (selected instanceof Date ? selected : new Date()))

  React.useEffect(() => {
    if (propMonth) {
      setMonth(propMonth)
    }
  }, [propMonth])

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newMonth = subMonths(month, 1)
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(month, 1)
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(month)
    const daysInMonth = getDaysInMonth(month)
    const dayOfWeek = getDay(firstDayOfMonth)

    // Adjust for week start day
    const startOffset = (dayOfWeek - weekStartsOn + 7) % 7

    // Generate days array
    const days: Date[] = []

    // Add days from previous month
    for (let i = 0; i < startOffset; i++) {
      days.push(addDays(firstDayOfMonth, i - startOffset))
    }

    // Add days from current month
    for (let i = 0; i < daysInMonth; i++) {
      days.push(addDays(firstDayOfMonth, i))
    }

    // Add days from next month to complete the grid (6 rows of 7 days)
    const remainingDays = 42 - days.length
    for (let i = 0; i < remainingDays; i++) {
      days.push(addDays(days[days.length - 1], 1))
    }

    return days
  }

  const days = generateCalendarDays()

  // Get weekday names
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const day = (i + weekStartsOn) % 7
    return format(new Date(2021, 0, day + 3), "EEE") // Using a fixed date to get weekday names
  })

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    if (!selected) return false

    if (selected instanceof Date) {
      return isSameDay(date, selected)
    }

    if (Array.isArray(selected)) {
      return selected.some((selectedDate) => isSameDay(date, selectedDate))
    }

    if ("from" in selected && "to" in selected) {
      const { from, to } = selected
      return date >= from && date <= to
    }

    return false
  }

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (disabled?.(date)) return
    onSelect?.(date)
  }

  return (
    <div className={cn("w-full p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-7 w-7 bg-transparent p-0">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="font-medium">{format(month, "MMMM yyyy")}</div>
        <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-7 w-7 bg-transparent p-0">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day, i) => (
          <div key={i} className="text-xs font-medium text-muted-foreground h-9 flex items-center justify-center">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const isSelected = isDateSelected(day)
          const isCurrentMonth = isSameMonth(day, month)
          const isDisabled = disabled?.(day) || false

          return (
            <div
              key={i}
              className={cn(
                "h-9 flex items-center justify-center text-sm p-0 relative",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isToday(day) && !isSelected && "bg-accent text-accent-foreground",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                !isSelected && !isToday(day) && "hover:bg-accent hover:text-accent-foreground",
                isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
              )}
            >
              <button
                type="button"
                className={cn("h-8 w-8 p-0 font-normal rounded-md", isDisabled && "cursor-not-allowed")}
                onClick={() => !isDisabled && handleDateSelect(day)}
                tabIndex={initialFocus && isCurrentMonth && !isDisabled ? 0 : -1}
                disabled={isDisabled}
              >
                {format(day, "d")}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

