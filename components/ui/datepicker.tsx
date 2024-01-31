"use client"
 
import * as React from "react"
import { format as __fnsFormat } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ErrorFormMessage from "../app/error-form-message"
import { formErrorClassNames } from "@/utils/app"
 
export function DatePicker(props: DatePickerProps) {
  const { date, onChangeDate, placeholder, format, triggerClassName, contentClassName, error, triggerWrapperClassName } = props;
  const [open, setOpen] = React.useState(false);

  const _format: any = () => {
    if (format) return format;
    return 'PPP';
  }

  const _defaultMonth = () => {
    if (date) {
      return new Date(date);
    }
    return new Date();
  };
 
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <div className={cn("flex flex-col gap-1", triggerWrapperClassName)}>
        <button
          type="button"
          className={cn(
            "w-[280px] justify-start text-left font-normal flex",
            !date && "text-muted-foreground",
            triggerClassName,
            error && formErrorClassNames,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {date ? __fnsFormat(date, _format()) : <span>{placeholder || 'Pick a date'}</span>}
        </button>
        {error && (
          <ErrorFormMessage 
            message={error.message} 
          />
        )}
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", contentClassName)}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onChangeDate && onChangeDate(date);
            setOpen(false);
          }}
          defaultMonth={_defaultMonth()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

type DatePickerProps = {
  date?: Date | undefined
  onChangeDate?: (date: Date | undefined) => void
  placeholder?: any
  format?: string | undefined
  triggerClassName?: string | undefined
  contentClassName?: string | undefined
  error?: any
  triggerWrapperClassName?: string | undefined
}