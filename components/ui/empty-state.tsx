"use client"

import { m } from "framer-motion"
import { ReactNode } from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import {
  ShoppingCart,
  Search,
  Package,
  Heart,
  FileQuestion,
  Inbox,
  AlertCircle
} from "lucide-react"

type EmptyStateType =
  | "cart"
  | "search"
  | "orders"
  | "wishlist"
  | "products"
  | "inbox"
  | "error"
  | "custom"

interface EmptyStateProps {
  /** Type of empty state for predefined illustrations */
  type?: EmptyStateType
  /** Custom icon/illustration */
  icon?: ReactNode
  /** Main title */
  title: string
  /** Description text */
  description?: string
  /** Primary action button */
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  /** Secondary action button */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Custom className */
  className?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

const iconMap: Record<Exclude<EmptyStateType, "custom">, ReactNode> = {
  cart: <ShoppingCart className="w-full h-full" strokeWidth={1} />,
  search: <Search className="w-full h-full" strokeWidth={1} />,
  orders: <Package className="w-full h-full" strokeWidth={1} />,
  wishlist: <Heart className="w-full h-full" strokeWidth={1} />,
  products: <FileQuestion className="w-full h-full" strokeWidth={1} />,
  inbox: <Inbox className="w-full h-full" strokeWidth={1} />,
  error: <AlertCircle className="w-full h-full" strokeWidth={1} />,
}

const sizeClasses = {
  sm: {
    container: "py-8",
    icon: "w-12 h-12",
    title: "text-lg",
    description: "text-sm",
  },
  md: {
    container: "py-12",
    icon: "w-16 h-16",
    title: "text-xl",
    description: "text-base",
  },
  lg: {
    container: "py-16",
    icon: "w-24 h-24",
    title: "text-2xl",
    description: "text-lg",
  },
}

/**
 * Empty State Component
 * 
 * Use this component to display friendly empty states
 * for cart, search results, orders, etc.
 * 
 * Features:
 * - Predefined illustrations for common states
 * - Custom icon support
 * - Primary and secondary actions
 * - Animated entrance
 * - Multiple size variants
 */
export function EmptyState({
  type = "custom",
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizes = sizeClasses[size]
  const displayIcon = type !== "custom" ? iconMap[type] : icon

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes.container,
        className
      )}
    >
      {displayIcon && (
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn(
            "text-muted-foreground/50 mb-4",
            sizes.icon
          )}
        >
          {displayIcon}
        </m.div>
      )}

      <m.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={cn("font-semibold text-foreground mb-2", sizes.title)}
      >
        {title}
      </m.h3>

      {description && (
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={cn(
            "text-muted-foreground max-w-sm mx-auto mb-6",
            sizes.description
          )}
        >
          {description}
        </m.p>
      )}

      {(action || secondaryAction) && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              size={size === "sm" ? "sm" : "default"}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              size={size === "sm" ? "sm" : "default"}
            >
              {secondaryAction.label}
            </Button>
          )}
        </m.div>
      )}
    </m.div>
  )
}

// Pre-configured empty states for common use cases
export function EmptyCart({ onContinueShopping }: { onContinueShopping?: () => void }) {
  if (onContinueShopping) {
    return (
      <EmptyState
        type="cart"
        title="Your cart is empty"
        description="Looks like you haven't added anything to your cart yet. Start exploring our products!"
        action={{ label: "Continue Shopping", onClick: onContinueShopping }}
      />
    )
  }
  return (
    <EmptyState
      type="cart"
      title="Your cart is empty"
      description="Looks like you haven't added anything to your cart yet. Start exploring our products!"
    />
  )
}

export function EmptySearchResults({
  query,
  onClearSearch
}: {
  query?: string
  onClearSearch?: () => void
}) {
  const description = query
    ? `We couldn't find anything matching "${query}". Try adjusting your search.`
    : "Try adjusting your search or filter criteria."

  if (onClearSearch) {
    return (
      <EmptyState
        type="search"
        title="No results found"
        description={description}
        action={{ label: "Clear Search", onClick: onClearSearch, variant: "outline" }}
      />
    )
  }
  return (
    <EmptyState
      type="search"
      title="No results found"
      description={description}
    />
  )
}

export function EmptyOrders({ onStartShopping }: { onStartShopping?: () => void }) {
  if (onStartShopping) {
    return (
      <EmptyState
        type="orders"
        title="No orders yet"
        description="When you place an order, it will appear here. Start shopping to see your order history!"
        action={{ label: "Start Shopping", onClick: onStartShopping }}
      />
    )
  }
  return (
    <EmptyState
      type="orders"
      title="No orders yet"
      description="When you place an order, it will appear here. Start shopping to see your order history!"
    />
  )
}

export function EmptyWishlist({ onExplore }: { onExplore?: () => void }) {
  if (onExplore) {
    return (
      <EmptyState
        type="wishlist"
        title="Your wishlist is empty"
        description="Save items you love by clicking the heart icon on any product."
        action={{ label: "Explore Products", onClick: onExplore }}
      />
    )
  }
  return (
    <EmptyState
      type="wishlist"
      title="Your wishlist is empty"
      description="Save items you love by clicking the heart icon on any product."
    />
  )
}

export default EmptyState
