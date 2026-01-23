/**
 * Test Shopify Connection Script
 * 
 * This script validates your Shopify configuration and tests the API connection.
 * Run with: node scripts/test-shopify-connection.js
 */

const { createStorefrontApiClient } = require('@shopify/storefront-api-client');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const config = {
  domain: process.env.SHOPIFY_STORE_DOMAIN || 'hydrogen-preview.myshopify.com',
  accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '3b580e70970c4528da70c98e097c2fa0',
  apiVersion: process.env.SHOPIFY_API_VERSION || '2026-01',
};

async function testShopifyConnection() {
  console.log('🧪 Testing Shopify Connection...\n');
  
  console.log('Configuration:');
  console.log(`  Store Domain: ${config.domain}`);
  console.log(`  API Version: ${config.apiVersion}`);
  console.log(`  Access Token: ${config.accessToken.substring(0, 8)}...`);
  console.log('');

  try {
    // Create Shopify client
    const client = createStorefrontApiClient({
      storeDomain: config.domain,
      apiVersion: config.apiVersion,
      publicAccessToken: config.accessToken,
    });

    // Test query to fetch shop information
    const query = `
      query {
        shop {
          name
          description
          primaryDomain {
            url
            host
          }
        }
      }
    `;

    console.log('📡 Making test request to Shopify...');
    const response = await client.request(query);
    
    if (response.errors) {
      console.error('❌ GraphQL Errors:', response.errors);
      return false;
    }

    if (response.data?.shop) {
      console.log('✅ Connection successful!');
      console.log(`  Shop Name: ${response.data.shop.name}`);
      console.log(`  Shop URL: ${response.data.shop.primaryDomain.url}`);
      
      if (response.data.shop.description) {
        console.log(`  Description: ${response.data.shop.description}`);
      }
      
      return true;
    } else {
      console.error('❌ No shop data received');
      return false;
    }

  } catch (error) {
    console.error('❌ Connection failed:');
    
    if (error.cause?.includes('ENOTFOUND')) {
      console.error('  🔧 DNS Resolution Error:');
      console.error(`     The domain '${config.domain}' could not be found`);
      console.error('  💡 Solutions:');
      console.error('     1. Check your internet connection');
      console.error('     2. Verify the store domain is correct');
      console.error('     3. Ensure the Shopify store exists and is active');
    } else if (error.message?.includes('401')) {
      console.error('  🔐 Authentication Error:');
      console.error('     Invalid access token');
      console.error('  💡 Solutions:');
      console.error('     1. Check your Storefront API access token');
      console.error('     2. Ensure the token has proper permissions');
    } else {
      console.error(`  Error: ${error.message}`);
      if (error.cause) {
        console.error(`  Cause: ${error.cause}`);
      }
    }
    
    return false;
  }
}

async function main() {
  const success = await testShopifyConnection();
  
  console.log('\n' + '='.repeat(50));
  
  if (success) {
    console.log('🎉 Shopify connection test PASSED!');
    console.log('Your Next.js app should now connect to Shopify successfully.');
  } else {
    console.log('💥 Shopify connection test FAILED!');
    console.log('\n📋 Next Steps:');
    console.log('1. Create .env.local file with your Shopify credentials');
    console.log('2. Get your store domain from your Shopify admin');
    console.log('3. Generate a Storefront API access token');
    console.log('4. Run this test again: node scripts/test-shopify-connection.js');
  }
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testShopifyConnection };
