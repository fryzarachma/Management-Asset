import * as React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
        outline: "text-secondary-950 border border-secondary-200",
        success: "bg-emerald-500 text-white hover:bg-emerald-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
    }

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-950 focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    )
})
Badge.displayName = "Badge"

export { Badge }
