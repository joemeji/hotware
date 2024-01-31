import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center rounded-sm border border-input bg-background ring-offset-background",
          disabled && "bg-stone-100"
        )}
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 outline-none",
            error &&
              "ring-2 ring-offset-2 ring-red-300 focus-visible:ring-red-300",
            disabled && "bg-stone-100",
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <span className="px-3 py-3 bg-stone-100">{label}</span>
      </div>
    );
  }
)
Input.displayName = "Input"

export { Input }
