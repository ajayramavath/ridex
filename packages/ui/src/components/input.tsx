import * as React from "react"
import { cn } from "@ridex/ui/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, inputSize = "md", ...props }, ref) => {
    return (
      <div className={cn(
        "relative flex items-center w-full",
        inputSize === "sm" && "h-8 text-sm",
        inputSize === "md" && "h-10 text-base",
        inputSize === "lg" && "h-12 text-lg"
      )}>
        {icon && (
          <span className="absolute left-3 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            className,
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            inputSize === "sm" && "pl-2 h-8",
            inputSize === "md" && "pl-4 h-10",
            inputSize === "lg" && "pl-12 h-12",
            icon && "pl-10",
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
