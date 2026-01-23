'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Mail, 
  Phone,
  MapPin,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit
} from 'lucide-react';
import { AdminMembershipService } from '@/lib/services/admin-membership-service';
import { AtpMembership, MembershipStats } from '@/lib/types/membership';

interface MembershipDetailsModalProps {
  membership: AtpMembership;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembershipUpdated: () => void;
}

export function MembershipDetailsModal({ 
  membership, 
  open, 
  onOpenChange, 
  onMembershipUpdated 
}: MembershipDetailsModalProps) {
  const [membershipDetails, setMembershipDetails] = useState<{
    membership: AtpMembership;
    customerInfo: any;
    stats: MembershipStats;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [extensionMonths, setExtensionMonths] = useState('12');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const adminService = new AdminMembershipService();

  useEffect(() => {
    if (open && membership) {
      loadMembershipDetails();
    }
  }, [open, membership]);

  const loadMembershipDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await adminService.getMembershipDetails(membership.id);
      setMembershipDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load membership details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendMembership = async () => {
    if (!reason.trim()) {
      setActionMessage({ type: 'error', text: 'Please provide a reason for extension' });
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage(null);

      await adminService.extendMembership(
        membership.id,
        parseInt(extensionMonths),
        reason
      );

      setActionMessage({ 
        type: 'success', 
        text: `Membership extended by ${extensionMonths} months` 
      });
      
      // Reload details and notify parent
      await loadMembershipDetails();
      onMembershipUpdated();
      
      // Reset form
      setReason('');
      setIsEditing(false);
    } catch (error) {
      setActionMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to extend membership' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!reason.trim()) {
      setActionMessage({ type: 'error', text: 'Please provide a reason for cancellation' });
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage(null);

      await adminService.cancelMembership(membership.id, reason);

      setActionMessage({ 
        type: 'success', 
        text: 'Membership has been cancelled' 
      });
      
      // Reload details and notify parent
      await loadMembershipDetails();
      onMembershipUpdated();
      
      // Reset form
      setReason('');
      setIsEditing(false);
    } catch (error) {
      setActionMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to cancel membership' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expiration = new Date(expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiration <= thirtyDaysFromNow;
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading membership details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={loadMembershipDetails} className="mt-4">
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!membershipDetails) {
    return null;
  }

  const { membership: currentMembership, customerInfo, stats } = membershipDetails;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Membership Details</span>
            {getStatusBadge(currentMembership.status)}
          </DialogTitle>
          <DialogDescription>
            Detailed information and management options for membership {currentMembership.id}
          </DialogDescription>
        </DialogHeader>

        {/* Action Message */}
        {actionMessage && (
          <Alert className={actionMessage.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            {actionMessage.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={actionMessage.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {actionMessage.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Membership Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Membership Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(currentMembership.status)}
                      {currentMembership.status === 'active' && isExpiringSoon(currentMembership.expirationDate) && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Start Date</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(currentMembership.startDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expiration Date</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(currentMembership.expirationDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Status</span>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={currentMembership.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {currentMembership.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits & Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits & Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Service Discount</span>
                    <Badge variant="secondary">
                      {(currentMembership.benefits.serviceDiscount * 100).toFixed(0)}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Free Delivery</span>
                    <Badge variant={currentMembership.benefits.freeDelivery ? 'default' : 'secondary'}>
                      {currentMembership.benefits.freeDelivery ? 'Yes' : 'No'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Savings</span>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold">{stats.totalSavings.toFixed(2)} AED</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Services Used</span>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{stats.servicesUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Free Deliveries</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{stats.ordersWithFreeDelivery}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">
                          {customerInfo.firstName} {customerInfo.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                      </div>
                    </div>

                    {customerInfo.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Customer Since</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(customerInfo.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Orders</p>
                        <p className="text-sm text-muted-foreground">{customerInfo.ordersCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Spent</p>
                        <p className="text-sm text-muted-foreground">{customerInfo.totalSpent} AED</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Administrative Actions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Extend Membership</CardTitle>
                    <CardDescription>
                      Add additional time to this membership
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Extension Period</Label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={extensionMonths}
                          onChange={(e) => setExtensionMonths(e.target.value)}
                        >
                          <option value="1">1 Month</option>
                          <option value="3">3 Months</option>
                          <option value="6">6 Months</option>
                          <option value="12">12 Months</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Reason for Extension</Label>
                      <Textarea
                        placeholder="Enter reason for extending this membership..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleExtendMembership}
                      disabled={actionLoading || !reason.trim()}
                      className="w-full"
                    >
                      {actionLoading ? 'Extending...' : `Extend by ${extensionMonths} Months`}
                    </Button>
                  </CardContent>
                </Card>

                {currentMembership.status !== 'cancelled' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Cancel Membership</CardTitle>
                      <CardDescription>
                        Permanently cancel this membership
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Reason for Cancellation</Label>
                        <Textarea
                          placeholder="Enter reason for cancelling this membership..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          This action cannot be undone. The member will lose all benefits immediately.
                        </AlertDescription>
                      </Alert>

                      <Button 
                        onClick={handleCancelMembership}
                        disabled={actionLoading || !reason.trim()}
                        variant="destructive"
                        className="w-full"
                      >
                        {actionLoading ? 'Cancelling...' : 'Cancel Membership'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>Click "Edit" to perform administrative actions on this membership.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}