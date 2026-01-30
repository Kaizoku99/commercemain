"use client"

import { useRTL } from "@/hooks/use-rtl"
import { cn } from "@/lib/utils"
import { type ReactNode, type HTMLAttributes, type ElementType } from "react"

interface RTLAwareProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: ElementType
}

export function RTLAware({ children, className, as: Component = "div", ...props }: RTLAwareProps) {
  const { isRTL, direction } = useRTL()

  return (
    <Component
      {...props}
      className={cn(
        className,
        isRTL && "rtl",
        !isRTL && "ltr"
      )}
      dir={direction}
    >
      {children}
    </Component>
  )
}

interface RTLFlexProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  reverse?: boolean
}

export function RTLFlex({ children, className, reverse = false, ...props }: RTLFlexProps) {
  const { isRTL } = useRTL()

  const shouldReverse = reverse ? !isRTL : isRTL

  return (
    <div
      {...props}
      className={cn(
        "flex",
        shouldReverse ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {children}
    </div>
  )
}

interface RTLGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  cols?: number
}

export function RTLGrid({ children, className, cols = 1, ...props }: RTLGridProps) {
  const { isRTL } = useRTL()

  return (
    <div
      {...props}
      className={cn(
        "grid",
        `grid-cols-${cols}`,
        isRTL && "rtl-grid",
        className
      )}
    >
      {children}
    </div>
  )
}

interface RTLTextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export function RTLText({ children, className, as: Component = "p", ...props }: RTLTextProps) {
  const { isRTL, language } = useRTL()

  return (
    <Component
      {...props}
      className={cn(
        isRTL && "text-right font-arabic",
        !isRTL && "text-left",
        language === "ar" && "arabic-text",
        className
      )}
    >
      {children}
    </Component>
  )
}

interface RTLButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function RTLButton({ children, className, ...props }: RTLButtonProps) {
  const { isRTL } = useRTL()

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center",
        isRTL && "flex-row-reverse",
        className
      )}
    >
      {children}
    </button>
  )
}

// Utility component for RTL-aware spacing
interface RTLSpacerProps {
  size?: "sm" | "md" | "lg" | "xl"
  direction?: "horizontal" | "vertical"
}

export function RTLSpacer({ size = "md", direction = "horizontal" }: RTLSpacerProps) {
  const { isRTL } = useRTL()

  const sizeClasses = {
    sm: direction === "horizontal" ? "w-2" : "h-2",
    md: direction === "horizontal" ? "w-4" : "h-4", 
    lg: direction === "horizontal" ? "w-6" : "h-6",
    xl: direction === "horizontal" ? "w-8" : "h-8",
  }

  return <div className={sizeClasses[size]} />
}

// RTL-aware icon wrapper
interface RTLIconProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  flip?: boolean
}

export function RTLIcon({ children, className, flip = false, ...props }: RTLIconProps) {
  const { isRTL } = useRTL()

  const shouldFlip = flip && isRTL

  return (
    <div
      {...props}
      className={cn(
        "inline-flex items-center justify-center",
        shouldFlip && "scale-x-[-1]",
        className
      )}
    >
      {children}
    </div>
  )
}