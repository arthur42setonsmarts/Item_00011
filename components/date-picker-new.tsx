"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarNew } from "@/components/ui/calendar-new"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePickerNew({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // More robust check for valid date
  const isValidDate = (value: any): boolean => {
    if (!value) return false
    if (value instanceof Date) return !isNaN(value.getTime())

    try {
      const date = new Date(value)
      return !isNaN(date.getTime())
    } catch (e) {
      return false
    }
  }

  // Use the function in the component
  const dateIsValid = isValidDate(date)

  const handleSelect = (date: Date | undefined) => {
    onSelect(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateIsValid && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
          onClick={() => setOpen(true)}
          type="button" // Important: prevent form submission
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateIsValid ? format(new Date(date as Date), "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarNew
          mode="single"
          selected={dateIsValid ? date : undefined}
          onSelect={handleSelect}
          initialFocus
          disabled={(date) => {
            // You can customize this to add date constraints
            const today = new Date()
            const minDate = new Date(1900, 0, 1)
            return date > new Date(today.getFullYear() + 10, today.getMonth(), today.getDate()) || date < minDate
          }}
          weekStartsOn={0} // 0 for Sunday, 1 for Monday
        />
      </PopoverContent>
    </Popover>
  )
}

