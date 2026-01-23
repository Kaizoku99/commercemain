/**
 * Membership Integrated Cart Component
 * 
 * Wrapper component that integrates membership benefits with existing cart functionality.
 * Automatically detects customer authentication and applies appropriate benefits.
 */

'use client';

import { useState, useEffect } from 'react';
import { useCart } from './cart-context';
import { useMembershipCart } from '@/hooks/use-membership-cart';
import { EnhancedCartModal } from './enhanced-cart-modal';
import { MembershipBenefitsDisplay } from './membership-benefits-display';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { DirhamSymbol } from '@/components/icons/dirham-symbol';

interface MembershipIntegratedCartProps {
  customerId?: string;
  showMembershipPrompt?: boolean;
  className?: string;
}

/**
 * Cart button with membership integration
 * Requirements: 4.3, 5.1, 5.2 - Show membership benefits in cart UI
 */
export function MembershipIntegratedCartButton({
  customerId,
  showMembershipPrompt = true,
  className = ''
}: MembershipIntegratedCartProps) {
  const t = useTranslations('cart');
  const { cart } = useCart();
  const { benefitsSummary, membershipStatus } = useMembershipCart(customerId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemCount = cart?.totalQuantity || 0;
  const hasItems = itemCount > 0;
  const hasBenefits = benefitsSummary.totalSavings > 0;

  return (
    <>
      <div className={`relative ${className}`}>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="sm"
          className="relative"
        >
          <ShoppingBagIcon className="h-4 w-4" />
          <span className="ml-2">
            {hasItems ? `${itemCount}` : t('cart')}
          </span>
          
          {/* Item count badge */}
          {hasItems && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
          
          {/* Membership savings indicator */}
          {hasBenefits && (
            <Badge 
              variant="secondary" 
              className="absolute -bottom-2 -right-2 bg-green-100 text-green-800 border-green-200 text-xs"
            >
              -{benefitsSummary.totalSavings.toFixed(0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Enhanced Cart Modal */}
      <EnhancedCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerId={customerId}
      />
    </>
  );
}

/**
 * Cart summary with membership benefits
 */
export function MembershipCartSummary({
  customerId,
  showMembershipPrompt = true,
  compact = false,
  className = ''
}: MembershipIntegratedCartProps & { compact?: boolean }) {
  const t = useTranslations('cart');
  const { cart } = useCart();
  const { 
    enhancedCart, 
    benefitsSummary, 
    membershipStatus,
    isLoadingBenefits 
  } = useMembershipCart(customerId);

  const displayCart = enhancedCart || cart;
  const hasItems = displayCart && displayCart.lines.length > 0;

  if (!hasItems) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">{t('yourCartIsEmpty')}</p>
        {showMembershipPrompt && (
          <div className="mt-4">
            <MembershipBenefitsDisplay 
              customerId={customerId}
              showSignupPrompt={true}
              compact={true}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Membership Benefits */}
      {customerId && (
        <MembershipBenefitsDisplay 
          customerId={customerId}
          showSignupPrompt={showMembershipPrompt}
          compact={compact}
        />
      )}

      {/* Cart Items Summary */}
      <div className="space-y-2">
        {displayCart.lines.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex-1">
              <span className="font-medium">{item.merchandise.product.title}</span>
              {item.quantity > 1 && (
                <span className="text-gray-500 ml-2">× {item.quantity}</span>
              )}
            </div>
            <div className="text-right">
              <span className="flex items-center gap-1">
                <DirhamSymbol size={14} />
                {parseFloat(item.cost.totalAmount.amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>{t('subtotal')}</span>
          <span className="flex items-center gap-1">
            <DirhamSymbol size={14} />
            {parseFloat(displayCart.cost.subtotalAmount.amount).toFixed(2)}
          </span>
        </div>
        
        {benefitsSummary.totalSavings > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t('memberSavings')}</span>
            <span className="flex items-center gap-1">
              -<DirhamSymbol size={14} />{benefitsSummary.totalSavings.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between font-bold">
          <span>{t('total')}</span>
          <span className="flex items-center gap-1">
            <DirhamSymbol size={14} />
            {parseFloat(displayCart.cost.totalAmount.amount).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini cart widget with membership integration
 */
export function MembershipMiniCart({
  customerId,
  className = ''
}: {
  customerId?: string;
  className?: string;
}) {
  const t = useTranslations('cart');
  const { cart } = useCart();
  const { benefitsSummary, membershipStatus } = useMembershipCart(customerId);
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = cart?.totalQuantity || 0;
  const hasItems = itemCount > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Mini cart trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <ShoppingBagIcon className="h-6 w-6" />
        {hasItems && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </button>

      {/* Mini cart dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <MembershipCartSummary
              customerId={customerId}
              compact={true}
            />
            
            {hasItems && (
              <div className="mt-4 space-y-2">
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to checkout
                    if (cart?.checkoutUrl) {
                      window.location.href = cart.checkoutUrl;
                    }
                  }}
                  className="w-full"
                >
                  {t('checkout')}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  {t('viewCart')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Cart page component with membership integration
 */
export function MembershipCartPage({
  customerId,
  className = ''
}: {
  customerId?: string;
  className?: string;
}) {
  const t = useTranslations('cart');
  const { 
    enhancedCart, 
    updateQuantityWithBenefits, 
    removeFromCartWithBenefits,
    validateMembershipStatus,
    isLoadingBenefits 
  } = useMembershipCart(customerId);

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityUpdate = async (
    lineId: string,
    merchandiseId: string,
    newQuantity: number
  ) => {
    setIsUpdating(lineId);
    try {
      await updateQuantityWithBenefits(lineId, merchandiseId, newQuantity);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    setIsUpdating(lineId);
    try {
      await removeFromCartWithBenefits(lineId);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCheckout = async () => {
    if (customerId) {
      await validateMembershipStatus();
    }
    
    if (enhancedCart?.checkoutUrl) {
      window.location.href = enhancedCart.checkoutUrl;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">{t('shoppingCart')}</h1>
          
          {!enhancedCart || enhancedCart.lines.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">{t('yourCartIsEmpty')}</h2>
              <p className="mt-2 text-gray-500">{t('startAddingItems')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enhancedCart.lines.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.merchandise.product.title}</h3>
                    <p className="text-sm text-gray-500">{item.merchandise.title}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => item.id && handleQuantityUpdate(
                        item.id,
                        item.merchandise.id,
                        item.quantity - 1
                      )}
                      disabled={isUpdating === item.id || item.quantity <= 1}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      -
                    </button>
                    
                    <span className="w-8 text-center">
                      {isUpdating === item.id ? '...' : item.quantity}
                    </span>
                    
                    <button
                      onClick={() => item.id && handleQuantityUpdate(
                        item.id,
                        item.merchandise.id,
                        item.quantity + 1
                      )}
                      disabled={isUpdating === item.id}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      <span className="flex items-center gap-1">
                        <DirhamSymbol size={14} />
                        {parseFloat(item.cost.totalAmount.amount).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => item.id && handleRemoveItem(item.id)}
                    disabled={isUpdating === item.id}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('remove')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <MembershipCartSummary
              customerId={customerId}
              showMembershipPrompt={true}
            />
            
            {enhancedCart && enhancedCart.lines.length > 0 && (
              <div className="mt-6">
                <Button
                  onClick={handleCheckout}
                  disabled={isLoadingBenefits}
                  className="w-full"
                  size="lg"
                >
                  {isLoadingBenefits ? t('validating') : t('proceedToCheckout')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}