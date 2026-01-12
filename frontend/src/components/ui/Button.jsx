import React from "react";
import { cn } from "../../utils/cn";

export function Button({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
}) {
    const buttonVariants = {
        default: "bg-primary text-white hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-surface text-primary border border-border hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:-translate-y-0.5",
        ghost: "text-primary hover:bg-gray-100 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
    };

    const buttonSizes = {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                buttonVariants[variant],
                buttonSizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
