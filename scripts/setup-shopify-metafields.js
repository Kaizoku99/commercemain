/**
 * Script to set up Shopify customer metafield definitions for ATP membership system
 * Run this script to configure the required metafields in your Shopify store
 */

const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-01';
const SHOPIFY_ADMIN_API_URL = process.env.SHOPIFY_STORE_DOMAIN 
  ? `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`
  : null;

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_ADMIN_API_URL || !SHOPIFY_ACCESS_TOKEN) {
  console.error('Missing required environment variables:');
  console.error('- SHOPIFY_STORE_DOMAIN');
  console.error('- SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

// Metafield definitions for ATP membership system
const METAFIELD_DEFINITIONS = [
  {
    namespace: 'atp',
    key: 'membership_status',
    name: 'ATP Membership Status',
    description: 'Current status of ATP membership (active, expired, cancelled)',
    type: 'single_line_text_field',
    validations: [
      {
        name: 'choices',
        value: JSON.stringify(['active', 'expired', 'cancelled'])
      }
    ]
  },
  {
    namespace: 'atp',
    key: 'membership_start_date',
    name: 'ATP Membership Start Date',
    description: 'Date when ATP membership started',
    type: 'date_time'
  },
  {
    namespace: 'atp',
    key: 'membership_expiration_date',
    name: 'ATP Membership Expiration Date',
    description: 'Date when ATP membership expires',
    type: 'date_time'
  },
  {
    namespace: 'atp',
    key: 'membership_subscription_id',
    name: 'ATP Membership Subscription ID',
    description: 'Shopify subscription ID for ATP membership',
    type: 'single_line_text_field'
  },
  {
    namespace: 'atp',
    key: 'membership_total_savings',
    name: 'ATP Membership Total Savings',
    description: 'Total amount saved through ATP membership discounts',
    type: 'money'
  },
  {
    namespace: 'atp',
    key: 'membership_services_used',
    name: 'ATP Membership Services Used',
    description: 'Number of services used with membership discount',
    type: 'number_integer'
  },
  {
    namespace: 'atp',
    key: 'membership_orders_with_free_delivery',
    name: 'ATP Membership Free Delivery Orders',
    description: 'Number of orders with free delivery benefit',
    type: 'number_integer'
  },
  {
    namespace: 'atp',
    key: 'membership_payment_status',
    name: 'ATP Membership Payment Status',
    description: 'Payment status of ATP membership (paid, pending, failed)',
    type: 'single_line_text_field',
    validations: [
      {
        name: 'choices',
        value: JSON.stringify(['paid', 'pending', 'failed'])
      }
    ]
  }
];

const CREATE_METAFIELD_DEFINITION_MUTATION = `
  mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        name
        namespace
        key
        type {
          name
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function createMetafieldDefinition(definition) {
  const response = await fetch(SHOPIFY_ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: CREATE_METAFIELD_DEFINITION_MUTATION,
      variables: {
        definition: {
          ...definition,
          ownerType: 'CUSTOMER'
        }
      }
    })
  });

  const result = await response.json();
  
  if (result.errors) {
    console.error(`Error creating metafield ${definition.namespace}.${definition.key}:`, result.errors);
    return false;
  }

  if (result.data.metafieldDefinitionCreate.userErrors.length > 0) {
    console.error(`User errors for ${definition.namespace}.${definition.key}:`, 
      result.data.metafieldDefinitionCreate.userErrors);
    return false;
  }

  console.log(`✅ Created metafield definition: ${definition.namespace}.${definition.key}`);
  return true;
}

async function setupMetafields() {
  console.log('🚀 Setting up Shopify customer metafield definitions for ATP membership...\n');

  let successCount = 0;
  let totalCount = METAFIELD_DEFINITIONS.length;

  for (const definition of METAFIELD_DEFINITIONS) {
    const success = await createMetafieldDefinition(definition);
    if (success) {
      successCount++;
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Setup complete: ${successCount}/${totalCount} metafield definitions created successfully`);
  
  if (successCount === totalCount) {
    console.log('✅ All metafield definitions created successfully!');
  } else {
    console.log('⚠️  Some metafield definitions failed to create. Check the errors above.');
    process.exit(1);
  }
}

// Run the setup
setupMetafields().catch(error => {
  console.error('❌ Failed to setup metafields:', error);
  process.exit(1);
});