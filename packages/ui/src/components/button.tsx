import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@ridex/ui/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/85 hover:shadow-[0_0_12px_4px] hover:shadow-primary/30 transition-all ease-in-out",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border border-input bg-background shadow-md hover:bg-accent hover:text-accent-foreground",
        secondary:
          "relative bg-secondary text-secondary-foreground shadow-md overflow-hidden before:absolute before:inset-0 before:scale-x-0 before:bg-secondary/70 before:origin-left before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-x-100",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  isLoading,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean,
    icon?: React.ReactNode,
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      {...(asChild ? {} : { "data-slot": "button" })}
      className={cn(buttonVariants({ variant, size, className }), "relative")}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="opacity-50">{children}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="size-4">{icon}</span>}
          {children}
        </div>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
