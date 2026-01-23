"use client";

import { useCart } from "@/components/cart/cart-context";
import { useMembership } from "@/hooks/use-membership";
import { useTranslations } from "@/hooks/use-translations";
import { useRTL } from "@/hooks/use-rtl";
import { ShoppingCartIcon, Crown, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MembershipBadge } from "@/components/membership/membership-badge";
import Price from "@/components/price";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { DeleteItemButton } from "@/components/cart/delete-item-button";
import { EditItemQuantityButton } from "@/components/cart/edit-item-quantity-button";
import { redirectToCheckout } from "@/components/cart/actions";
import { useFormStatus } from "react-dom";
import LoadingDots from "@/components/loading-dots";
import type { CartItem } from "@/lib/shopify/types";
import { useMemo } from "react";

type MerchandiseSearchParams = {
    [key: string]: string;
};

export function CartPageContent() {
    const { cart, updateCartItem } = useCart();
    const { membership, isMember, getMemberPrice } = useMembership();
    const { t, formatPrice } = useTranslations();
    const { isRTL } = useRTL();

    // Calculate member savings - Memoized
    const memberSavings = useMemo(() => {
        if (!cart || !isMember)
            return { originalTotal: 0, memberTotal: 0, totalSavings: 0 };

        let originalTotal = 0;
        let memberTotal = 0;

        const safeLines = Array.isArray(cart.lines) ? cart.lines : [];

        safeLines.forEach((item: CartItem) => {
            const itemPrice = Number.parseFloat(item.cost.totalAmount.amount);
            const pricing = getMemberPrice((itemPrice / item.quantity).toString());

            originalTotal += pricing.originalPrice * item.quantity;
            memberTotal += pricing.memberPrice * item.quantity;
        });

        return {
            originalTotal,
            memberTotal,
            totalSavings: originalTotal - memberTotal,
        };
    }, [cart, isMember, getMemberPrice]);

    if (!cart || !Array.isArray(cart.lines) || cart.lines.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <Button variant="ghost" asChild className="mb-4">
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    </div>

                    <Card className="max-w-md mx-auto text-center">
                        <CardContent className="pt-12 pb-8">
                            <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start shopping to add items to your cart
                            </p>
                            <Button asChild>
                                <Link href="/">Start Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">Shopping Cart</h1>
                            {isMember && membership?.tier && (
                                <MembershipBadge tier={membership.tier as "premium" | "elite" | "essential" | "atp"} className="text-sm" />
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {cart.lines.length} {cart.lines.length === 1 ? "item" : "items"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        {/* Member Benefits Banner */}
                        {!isMember && (
                            <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Crown className="w-6 h-6 text-yellow-600" />
                                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                                            Unlock Member Benefits
                                        </h3>
                                    </div>
                                    <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                                        Save up to 20% on your entire order, get free shipping, and
                                        enjoy exclusive member perks.
                                    </p>
                                    <Button
                                        asChild
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                        <Link href="/atp-membership">Join ATP Membership</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Cart Items</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {cart.lines.map((item: CartItem, i: number) => {
                                        const merchandiseSearchParams =
                                            {} as MerchandiseSearchParams;

                                        item.merchandise.selectedOptions.forEach(
                                            ({ name, value }) => {
                                                if (value !== DEFAULT_OPTION) {
                                                    merchandiseSearchParams[name.toLowerCase()] = value;
                                                }
                                            }
                                        );

                                        const merchandiseUrl = createUrl(
                                            `/product/${item.merchandise.product.handle}`,
                                            new URLSearchParams(merchandiseSearchParams)
                                        );

                                        const itemPrice = Number.parseFloat(
                                            item.cost.totalAmount.amount
                                        );
                                        const unitPrice = itemPrice / item.quantity;
                                        const pricing = isMember
                                            ? getMemberPrice(unitPrice.toString())
                                            : null;

                                        return (
                                            <div key={i} className="p-6">
                                                <div className="flex gap-4">
                                                    <div className="relative">
                                                        <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
                                                            <Image
                                                                className="h-full w-full object-cover"
                                                                width={96}
                                                                height={96}
                                                                alt={
                                                                    item.merchandise.product.featuredImage
                                                                        .altText || item.merchandise.product.title
                                                                }
                                                                src={
                                                                    item.merchandise.product.featuredImage.url ||
                                                                    "/placeholder.svg"
                                                                }
                                                            />
                                                        </div>
                                                        <div className="absolute -top-2 -right-2">
                                                            <DeleteItemButton
                                                                item={item}
                                                                optimisticUpdate={updateCartItem}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={merchandiseUrl}
                                                            className="block hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                {item.merchandise.product.title}
                                                            </h3>
                                                            {item.merchandise.title !== DEFAULT_OPTION && (
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                    {item.merchandise.title}
                                                                </p>
                                                            )}
                                                        </Link>

                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    Qty:
                                                                </span>
                                                                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                                                                    <EditItemQuantityButton
                                                                        item={item}
                                                                        type="minus"
                                                                        optimisticUpdate={updateCartItem}
                                                                    />
                                                                    <span className="px-3 py-1 text-sm font-medium">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <EditItemQuantityButton
                                                                        item={item}
                                                                        type="plus"
                                                                        optimisticUpdate={updateCartItem}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="text-right">
                                                                {isMember && pricing && pricing.savings > 0 ? (
                                                                    <div>
                                                                        <span className="text-sm text-gray-500 line-through block">
                                                                            {formatPrice(
                                                                                pricing.originalPrice * item.quantity
                                                                            )}
                                                                        </span>
                                                                        <Price
                                                                            className="text-lg font-semibold text-yellow-600"
                                                                            amount={(
                                                                                pricing.memberPrice * item.quantity
                                                                            ).toFixed(2)}
                                                                            currencyCode={
                                                                                item.cost.totalAmount.currencyCode
                                                                            }
                                                                        />
                                                                        <span className="text-xs text-yellow-600 block">
                                                                            Save{" "}
                                                                            {formatPrice(
                                                                                pricing.savings * item.quantity
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <Price
                                                                        className="text-lg font-semibold"
                                                                        amount={item.cost.totalAmount.amount}
                                                                        currencyCode={
                                                                            item.cost.totalAmount.currencyCode
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Member Savings Summary */}
                                {isMember && memberSavings.totalSavings > 0 && (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Star className="w-5 h-5 text-yellow-600" />
                                            <span className="font-medium text-yellow-800 dark:text-yellow-200">
                                                Member Savings
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Original Total:</span>
                                                <span>{formatPrice(memberSavings.originalTotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Member Price:</span>
                                                <span>{formatPrice(memberSavings.memberTotal)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-semibold text-yellow-700 dark:text-yellow-300">
                                                <span>You Save:</span>
                                                <span>{formatPrice(memberSavings.totalSavings)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <Price
                                            amount={
                                                isMember
                                                    ? memberSavings.memberTotal.toFixed(2)
                                                    : cart.cost.subtotalAmount.amount
                                            }
                                            currencyCode={cart.cost.subtotalAmount.currencyCode}
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        {isMember ? (
                                            <span className="text-yellow-600 font-medium">Free</span>
                                        ) : (
                                            <span className="text-gray-500">
                                                Calculated at checkout
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Taxes:</span>
                                        <span className="text-gray-500">Calculated at checkout</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <Price
                                            amount={
                                                isMember
                                                    ? memberSavings.memberTotal.toFixed(2)
                                                    : cart.cost.totalAmount.amount
                                            }
                                            currencyCode={cart.cost.totalAmount.currencyCode}
                                        />
                                    </div>
                                </div>

                                <form action={redirectToCheckout} className="w-full">
                                    <CheckoutButton isMember={isMember} />
                                </form>

                                <div className="text-center">
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/">Continue Shopping</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckoutButton({ isMember }: { isMember: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className={`w-full ${isMember
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
        >
            {pending ? (
                <LoadingDots className="bg-white" />
            ) : (
                <div className="flex items-center justify-center gap-2">
                    {isMember && <Crown className="w-4 h-4" />}
                    {isMember ? "Proceed to Premium Checkout" : "Proceed to Checkout"}
                </div>
            )}
        </Button>
    );
}
