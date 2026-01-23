# ATP Membership Admin Dashboard

This directory contains the administrative dashboard components for managing ATP Group Services memberships.

## Components

### AdminMembershipDashboard
Main dashboard component that provides:
- Membership analytics overview
- Search and filter functionality
- Bulk management actions
- Data export capabilities

### MembershipSearchComponent
Advanced search interface for finding and managing individual memberships:
- Search by customer ID, email, or membership ID
- Filter by status (active, expired, cancelled, pending)
- Date range filtering
- Pagination support
- Individual membership details view

### MembershipAnalyticsComponent
Analytics and reporting dashboard showing:
- Revenue metrics (total, monthly, per member)
- Membership distribution by status
- Growth metrics and KPIs
- Action items and alerts
- Program health indicators

### MembershipManagementComponent
Bulk management tools for:
- Extending memberships manually
- Cancelling memberships with reason tracking
- Exporting membership data (CSV format)
- Administrative actions with audit logging

### MembershipDetailsModal
Detailed view and management for individual memberships:
- Complete membership information
- Customer details and history
- Usage statistics and savings
- Administrative actions (extend/cancel)
- Audit trail for changes

### AdminLayout
Consistent layout wrapper providing:
- Admin navigation header
- Access control indicators
- System status information
- Responsive design

### AdminAuthGuard
Security component that:
- Protects admin routes with password authentication
- Manages admin session state
- Provides secure logout functionality
- Simple password-based access control

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/admin/membership`
2. Enter the admin password (default: `admin123`)
3. Access the full membership management interface

### Key Features

#### Analytics Overview
- View total memberships, revenue, and growth metrics
- Monitor renewal rates and program health
- Identify expiring memberships requiring attention

#### Search & Management
- Find specific memberships using various filters
- View detailed customer and membership information
- Perform administrative actions on individual memberships

#### Bulk Operations
- Extend multiple memberships
- Export data for reporting
- Manage membership lifecycle events

#### Data Export
- Export all membership data
- Filter exports by status or date range
- CSV format for external analysis

## Configuration

### Environment Variables
- `NEXT_PUBLIC_ADMIN_PASSWORD`: Admin dashboard password (default: admin123)

### Security Considerations
- Admin password is stored in environment variables
- Session state managed in localStorage
- All administrative actions are logged
- Audit trail maintained for membership changes

## API Integration

The dashboard integrates with:
- `AdminMembershipService`: Core admin operations
- `ShopifyIntegrationService`: Customer and membership data
- `AtpMembershipService`: Business logic and validation

## Customization

### Adding New Analytics
1. Extend `MembershipAnalytics` interface in `lib/types/membership.ts`
2. Update `AdminMembershipService.getMembershipAnalytics()`
3. Add visualization in `MembershipAnalyticsComponent`

### Adding New Actions
1. Add method to `AdminMembershipService`
2. Create UI in `MembershipManagementComponent`
3. Update audit logging as needed

### Styling
- Uses Tailwind CSS for styling
- Consistent with main application design system
- Responsive design for mobile and desktop

## Development

### Testing
- Component tests in `__tests__/admin/`
- Service tests for admin operations
- Integration tests for complete workflows

### Deployment
- Admin routes protected by authentication
- Environment-specific configuration
- Monitoring and logging integration

## Support

For issues or questions regarding the admin dashboard:
1. Check component documentation
2. Review service layer implementations
3. Verify environment configuration
4. Check browser console for errors