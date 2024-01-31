"use client";

import * as React from "react";
import { format as __fnsFormat } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ErrorFormMessage from "../app/error-form-message";

type DatePickerWithRange = {
  date?: DateRange | undefined
  onChangeDate?: (date: DateRange | undefined) => void
  placeholder?: any
  format?: string | undefined
  classNames?: {
    containerClassName?: string | undefined
    triggerClassName?: string | undefined
    contentClassName?: string | undefined
  }
  error?: any
}

export default function DatePickerWithRange(props: DatePickerWithRange) {
  const { date, onChangeDate, placeholder, format: format, classNames, error } = props;

  const _format: any = () => {
    if (format) return format;
    return 'LLL dd, y';
  }

  return (
    <div className={cn("grid gap-2", classNames?.containerClassName)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-1"> 
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
                classNames?.triggerClassName
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {__fnsFormat(date?.from || new Date(), _format())} -{" "}
                    {__fnsFormat(date?.to || new Date(), _format())}
                  </>
                ) : (
                  __fnsFormat(date?.from || new Date(), _format())
                )
              ) : (
                <span>{placeholder || 'Pick a date'}</span>
              )}
            </Button>
            {error && (
              <ErrorFormMessage 
                message={error.message} 
              />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", classNames?.contentClassName)} align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={onChangeDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
