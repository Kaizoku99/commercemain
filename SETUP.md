# Shopify E-commerce Setup Guide

## Environment Variables Required

To fix the "Invalid URL" error, you need to configure the following environment variables:

### 1. Create a `.env.local` file in the root directory with:

\`\`\`bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret

# Base URL (optional)
VERCEL_PROJECT_PRODUCTION_URL=your-production-url.vercel.app
\`\`\`

### 2. How to get Shopify credentials:

1. **SHOPIFY_STORE_DOMAIN**: Your Shopify store domain (e.g., `my-store.myshopify.com`)
2. **SHOPIFY_STOREFRONT_ACCESS_TOKEN**:
   - Go to your Shopify Admin
   - Navigate to Settings > Apps and sales channels > Develop apps
   - Create a new app or select existing one
   - Go to API credentials
   - Create a Storefront API access token
3. **SHOPIFY_REVALIDATION_SECRET**: Any secure random string for webhook validation

### 3. Restart your development server:

\`\`\`bash
npm run dev
\`\`\`

## Error Resolution

The "Invalid URL" error was caused by:

- Missing Shopify domain configuration
- Incorrect GraphQL endpoint path
- Missing environment variable validation

These issues have been fixed in the codebase.

## Testing

After setting up the environment variables, the application should:

- Load without URL parsing errors
- Successfully connect to Shopify's GraphQL API
- Display products and collections properly
