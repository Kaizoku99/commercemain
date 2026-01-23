'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  User,
  CreditCard,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { AdminMembershipService, AdminMembershipFilters, MembershipSearchResult } from '@/lib/services/admin-membership-service';
import { AtpMembership, MembershipStatus } from '@/lib/types/membership';
import { MembershipDetailsModal } from './membership-details-modal';

export function MembershipSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MembershipStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [searchResults, setSearchResults] = useState<MembershipSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMembership, setSelectedMembership] = useState<AtpMembership | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const adminService = new AdminMembershipService();

  useEffect(() => {
    handleSearch();
  }, [currentPage, statusFilter]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      
      const filters: AdminMembershipFilters = {};
      
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter as MembershipStatus;
      }
      
      if (dateRange) {
        filters.dateRange = dateRange;
      }

      const results = await adminService.searchMemberships(filters, currentPage, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (membership: AtpMembership) => {
    setSelectedMembership(membership);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: MembershipStatus) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expiration = new Date(expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiration <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search Memberships</CardTitle>
          <CardDescription>
            Find and manage individual memberships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer ID, email, or membership ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MembershipStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value, end: prev?.end || '' }))}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value, start: prev?.start || '' }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>
              Search Results ({searchResults.totalCount} memberships)
            </CardTitle>
            <CardDescription>
              Page {searchResults.currentPage} of {searchResults.totalPages}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.memberships.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No memberships found matching your criteria
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.memberships.map((membership) => (
                        <TableRow key={membership.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{membership.customerId}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {membership.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(membership.status)}
                              {membership.status === 'active' && isExpiringSoon(membership.expirationDate) && (
                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                  Expiring Soon
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(membership.startDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(membership.expirationDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <Badge 
                                variant={membership.paymentStatus === 'paid' ? 'default' : 'secondary'}
                              >
                                {membership.paymentStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(membership)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {searchResults.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, searchResults.totalCount)} of {searchResults.totalCount} results
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(searchResults.totalPages, prev + 1))}
                        disabled={currentPage === searchResults.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Membership Details Modal */}
      {selectedMembership && (
        <MembershipDetailsModal
          membership={selectedMembership}
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          onMembershipUpdated={() => {
            handleSearch(); // Refresh search results
            setShowDetailsModal(false);
          }}
        />
      )}
    </div>
  );
}