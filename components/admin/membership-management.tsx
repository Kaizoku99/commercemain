'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { AdminMembershipService } from '@/lib/services/admin-membership-service';

export function MembershipManagementComponent() {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [membershipId, setMembershipId] = useState('');
  const [extensionMonths, setExtensionMonths] = useState('12');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const adminService = new AdminMembershipService();

  const handleExtendMembership = async () => {
    if (!membershipId || !reason) {
      setMessage({ type: 'error', text: 'Please provide membership ID and reason' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      await adminService.extendMembership(
        membershipId,
        parseInt(extensionMonths),
        reason
      );

      setMessage({ 
        type: 'success', 
        text: `Membership ${membershipId} extended by ${extensionMonths} months` 
      });
      
      // Reset form
      setMembershipId('');
      setReason('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to extend membership' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!membershipId || !reason) {
      setMessage({ type: 'error', text: 'Please provide membership ID and reason' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      await adminService.cancelMembership(membershipId, reason);

      setMessage({ 
        type: 'success', 
        text: `Membership ${membershipId} has been cancelled` 
      });
      
      // Reset form
      setMembershipId('');
      setReason('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to cancel membership' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAllData = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const csvData = await adminService.exportMembershipData({}, 'csv');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-memberships-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Membership data exported successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to export membership data' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Management Actions</CardTitle>
          <CardDescription>
            Perform administrative actions on memberships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant={selectedAction === 'extend' ? 'default' : 'outline'}
              onClick={() => setSelectedAction('extend')}
              className="h-20 flex-col space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Extend Membership</span>
            </Button>

            <Button
              variant={selectedAction === 'cancel' ? 'default' : 'outline'}
              onClick={() => setSelectedAction('cancel')}
              className="h-20 flex-col space-y-2"
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Cancel Membership</span>
            </Button>

            <Button
              variant={selectedAction === 'export' ? 'default' : 'outline'}
              onClick={() => setSelectedAction('export')}
              className="h-20 flex-col space-y-2"
            >
              <Download className="h-6 w-6" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Display */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          {message.type === 'error' ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Extend Membership Form */}
      {selectedAction === 'extend' && (
        <Card>
          <CardHeader>
            <CardTitle>Extend Membership</CardTitle>
            <CardDescription>
              Manually extend a membership duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="membershipId">Membership ID</Label>
                <Input
                  id="membershipId"
                  placeholder="Enter membership ID"
                  value={membershipId}
                  onChange={(e) => setMembershipId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extensionMonths">Extension Period</Label>
                <Select value={extensionMonths} onValueChange={setExtensionMonths}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Extension</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for extending this membership..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleExtendMembership} 
              disabled={isLoading || !membershipId || !reason}
              className="w-full"
            >
              {isLoading ? 'Extending...' : `Extend Membership by ${extensionMonths} Months`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cancel Membership Form */}
      {selectedAction === 'cancel' && (
        <Card>
          <CardHeader>
            <CardTitle>Cancel Membership</CardTitle>
            <CardDescription>
              Manually cancel a membership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancelMembershipId">Membership ID</Label>
              <Input
                id="cancelMembershipId"
                placeholder="Enter membership ID to cancel"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancelReason">Reason for Cancellation</Label>
              <Textarea
                id="cancelReason"
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
              disabled={isLoading || !membershipId || !reason}
              variant="destructive"
              className="w-full"
            >
              {isLoading ? 'Cancelling...' : 'Cancel Membership'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Export Data Options */}
      {selectedAction === 'export' && (
        <Card>
          <CardHeader>
            <CardTitle>Export Membership Data</CardTitle>
            <CardDescription>
              Download membership data for reporting and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Download className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">All Memberships</h4>
                    <p className="text-sm text-muted-foreground">
                      Export complete membership database
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleExportAllData} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? 'Exporting...' : 'Export All Data (CSV)'}
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Active Members Only</h4>
                    <p className="text-sm text-muted-foreground">
                      Export only active memberships
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => adminService.exportMembershipData({ status: 'active' }, 'csv')} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Export Active Members
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium">Expiring Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      Export memberships expiring in 30 days
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                    adminService.exportMembershipData({
                      dateRange: {
                        start: new Date().toISOString().split('T')[0] ?? '',
                        end: thirtyDaysFromNow.toISOString().split('T')[0] ?? ''
                      }
                    }, 'csv');
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Export Expiring Soon
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Custom Export</h4>
                    <p className="text-sm text-muted-foreground">
                      Use search filters to export
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setSelectedAction('')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Search & Filter
                </Button>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}