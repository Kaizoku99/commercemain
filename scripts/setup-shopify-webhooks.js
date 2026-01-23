/**
 * Script to set up Shopify webhooks for ATP membership system
 * Run this script to configure the required webhooks in your Shopify store
 */

const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-01';
const SHOPIFY_ADMIN_API_URL = process.env.SHOPIFY_STORE_DOMAIN 
  ? `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`
  : null;

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const WEBHOOK_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;

if (!SHOPIFY_ADMIN_API_URL || !SHOPIFY_ACCESS_TOKEN) {
  console.error('Missing required environment variables:');
  console.error('- SHOPIFY_STORE_DOMAIN');
  console.error('- SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

if (!WEBHOOK_BASE_URL) {
  console.error('Missing webhook base URL. Set NEXT_PUBLIC_SITE_URL or VERCEL_URL');
  process.exit(1);
}

// Webhook configurations for ATP membership system
const WEBHOOK_SUBSCRIPTIONS = [
  {
    topic: 'ORDERS_PAID',
    callbackUrl: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/paid`,
    format: 'JSON',
    includeFields: [
      'id',
      'customer',
      'line_items',
      'subscription_id',
      'financial_status',
      'fulfillment_status'
    ]
  },
  {
    topic: 'CUSTOMERS_UPDATE',
    callbackUrl: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/customers/update`,
    format: 'JSON',
    includeFields: [
      'id',
      'email',
      'metafields'
    ]
  },
  {
    topic: 'ORDERS_CANCELLED',
    callbackUrl: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/cancelled`,
    format: 'JSON',
    includeFields: [
      'id',
      'customer',
      'line_items',
      'cancel_reason'
    ]
  },
  {
    topic: 'ORDERS_REFUNDED',
    callbackUrl: `${WEBHOOK_BASE_URL}/api/webhooks/shopify/orders/refunded`,
    format: 'JSON',
    includeFields: [
      'id',
      'customer',
      'line_items',
      'refunds'
    ]
  }
];

const CREATE_WEBHOOK_SUBSCRIPTION_MUTATION = `
  mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
      webhookSubscription {
        id
        callbackUrl
        topic
        format
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const LIST_WEBHOOK_SUBSCRIPTIONS_QUERY = `
  query {
    webhookSubscriptions(first: 50) {
      edges {
        node {
          id
          callbackUrl
          topic
          format
        }
      }
    }
  }
`;

async function listExistingWebhooks() {
  const response = await fetch(SHOPIFY_ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: LIST_WEBHOOK_SUBSCRIPTIONS_QUERY
    })
  });

  const result = await response.json();
  
  if (result.errors) {
    console.error('Error listing webhooks:', result.errors);
    return [];
  }

  return result.data.webhookSubscriptions.edges.map(edge => edge.node);
}

async function createWebhookSubscription(subscription) {
  const response = await fetch(SHOPIFY_ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: CREATE_WEBHOOK_SUBSCRIPTION_MUTATION,
      variables: {
        topic: subscription.topic,
        webhookSubscription: {
          callbackUrl: subscription.callbackUrl,
          format: subscription.format,
          includeFields: subscription.includeFields
        }
      }
    })
  });

  const result = await response.json();
  
  if (result.errors) {
    console.error(`Error creating webhook ${subscription.topic}:`, result.errors);
    return false;
  }

  if (result.data.webhookSubscriptionCreate.userErrors.length > 0) {
    console.error(`User errors for ${subscription.topic}:`, 
      result.data.webhookSubscriptionCreate.userErrors);
    return false;
  }

  console.log(`✅ Created webhook subscription: ${subscription.topic} -> ${subscription.callbackUrl}`);
  return true;
}

async function setupWebhooks() {
  console.log('🚀 Setting up Shopify webhooks for ATP membership system...\n');
  console.log(`📍 Webhook base URL: ${WEBHOOK_BASE_URL}\n`);

  // List existing webhooks
  const existingWebhooks = await listExistingWebhooks();
  console.log(`📋 Found ${existingWebhooks.length} existing webhooks\n`);

  let successCount = 0;
  let skippedCount = 0;
  let totalCount = WEBHOOK_SUBSCRIPTIONS.length;

  for (const subscription of WEBHOOK_SUBSCRIPTIONS) {
    // Check if webhook already exists
    const existingWebhook = existingWebhooks.find(webhook => 
      webhook.topic === subscription.topic && 
      webhook.callbackUrl === subscription.callbackUrl
    );

    if (existingWebhook) {
      console.log(`⏭️  Skipping ${subscription.topic} (already exists)`);
      skippedCount++;
      continue;
    }

    const success = await createWebhookSubscription(subscription);
    if (success) {
      successCount++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Setup complete:`);
  console.log(`  ✅ Created: ${successCount} webhooks`);
  console.log(`  ⏭️  Skipped: ${skippedCount} webhooks (already exist)`);
  console.log(`  📝 Total: ${totalCount} webhooks configured`);
  
  if (successCount + skippedCount === totalCount) {
    console.log('\n🎉 All webhook subscriptions are configured successfully!');
  } else {
    console.log('\n⚠️  Some webhook subscriptions failed to create. Check the errors above.');
    process.exit(1);
  }
}

// Run the setup
setupWebhooks().catch(error => {
  console.error('❌ Failed to setup webhooks:', error);
  process.exit(1);
});