import React from "react"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"

    const variants = {
      primary: "bg-primary text-white hover:bg-primary-700 focus:ring-primary shadow-premium",
      secondary: "bg-secondary text-secondary-foreground hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus:ring-slate-400",
      outline: "border border-border bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground focus:ring-slate-400",
      ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground focus:ring-slate-400",
      destructive: "bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive shadow-sm",
    }

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-lg",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3 rounded-2xl",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = "Button"
