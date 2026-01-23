/**
 * ATP Membership Account Page
 * 
 * Account page for managing ATP membership subscription.
 */

'use client';

import { useCustomer } from '@/hooks/use-customer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AtpMembershipDashboard } from '@/components/membership/atp-membership-dashboard';
import { MembershipProvider } from '@/hooks/use-atp-membership-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MembershipAccountPage() {
  const { customer, isLoading } = useCustomer();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push('/auth/login');
    }
  }, [customer, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/account" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Account
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">ATP Membership</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your ATP membership and view benefits
              </p>
            </div>
          </div>

          {/* Membership Dashboard */}
          <MembershipProvider customerId={customer.id}>
            <AtpMembershipDashboard customerId={customer.id} />
          </MembershipProvider>
        </div>
      </div>
    </div>
  );
}