"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { useTranslations } from "next-intl"

// Context for sharing quantity state
interface QuantityContextType {
  quantity: number
  setQuantity: (quantity: number) => void
}

const QuantityContext = createContext<QuantityContextType | undefined>(undefined)

export function QuantityProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <QuantityContext.Provider value={{ quantity, setQuantity }}>
      {children}
    </QuantityContext.Provider>
  )
}

export function useQuantity() {
  const context = useContext(QuantityContext)
  if (context === undefined) {
    throw new Error("useQuantity must be used within a QuantityProvider")
  }
  return context
}

interface QuantitySelectorProps {
  productId: string
  className?: string
}

export function QuantitySelector({ productId, className }: QuantitySelectorProps) {
  const { quantity, setQuantity } = useQuantity()
  const { cart } = useCart()

  // Find if this product is already in cart
  const cartItem = cart?.lines?.find(
    (line) => line.merchandise.product.id === productId
  )
  const cartQuantity = cartItem?.quantity || 0

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1)
  }

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    handleQuantityChange(value)
  }

  const t = useTranslations('product')

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-gray-600">
        {t('quantity')} {cartQuantity > 0 && `(${cartQuantity} ${t('inCart')})`}
      </Label>
      <div className="flex items-center border border-gray-200 rounded-lg w-fit">
        <Button
          variant="ghost"
          size="sm"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
          className="h-10 w-10 p-0 hover:bg-gray-100 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={handleInputChange}
          className="h-10 w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={incrementQuantity}
          className="h-10 w-10 p-0 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}