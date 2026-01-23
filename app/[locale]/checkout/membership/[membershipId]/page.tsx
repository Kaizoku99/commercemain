import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { createCart } from '@/lib/shopify/server';

interface MembershipCheckoutPageProps {
  params: Promise<{
    locale: string;
    membershipId: string;
  }>;
  searchParams: Promise<{
    variantId?: string;
  }>;
}

export async function generateMetadata({ params }: MembershipCheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: locale === 'ar' ? 'الدفع - عضوية ATP' : 'Checkout - ATP Membership',
    description: locale === 'ar' ? 'إتمام شراء عضوية ATP' : 'Complete your ATP Membership purchase',
  };
}

export default async function MembershipCheckoutPage({ 
  params,
  searchParams 
}: MembershipCheckoutPageProps) {
  const { locale, membershipId } = await params;
  const { variantId } = await searchParams;
  
  try {
    // If we have a variantId (from the membership product), create a cart and checkout
    if (variantId) {
      // Create a new cart with the membership product
      const cart = await createCart([{
        merchandiseId: variantId,
        quantity: 1
      }]);
      
      // Redirect to Shopify's checkout
      if (cart.checkoutUrl) {
        redirect(cart.checkoutUrl);
      }
    }
    
    // If no variant ID, redirect to membership page
    // This could happen if the membership product is not set up in Shopify yet
    redirect(`/${locale}/atp-membership?error=checkout_failed`);
    
  } catch (error) {
    console.error('Membership checkout error:', error);
    redirect(`/${locale}/atp-membership?error=checkout_failed`);
  }
}
