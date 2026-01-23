import { Metadata } from 'next';
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminMembershipDashboard } from '@/components/admin/admin-membership-dashboard';

export const metadata: Metadata = {
  title: 'Membership Admin Dashboard - ATP Group Services',
  description: 'Administrative dashboard for managing ATP Group Services memberships',
};

export default function AdminMembershipPage() {
  return (
    <AdminAuthGuard>
      <AdminLayout title="Membership Management">
        <AdminMembershipDashboard />
      </AdminLayout>
    </AdminAuthGuard>
  );
}