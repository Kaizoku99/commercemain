import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up E2E test environment...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the application to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    console.log(`📡 Checking if application is ready at ${baseURL}`);
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Verify the application is working
    await page.waitForSelector('body', { timeout: 30000 });
    console.log('✅ Application is ready');
    
    // Set up test data if needed
    await setupTestData(page);
    
    // Set up authentication state if needed
    await setupAuthState(page);
    
  } catch (error) {
    console.error('❌ Failed to set up E2E test environment:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ E2E test environment setup complete');
}

async function setupTestData(page: any) {
  // Set up any required test data
  console.log('📊 Setting up test data...');
  
  // Mock localStorage data for tests
  await page.addInitScript(() => {
    // Clear any existing data
    localStorage.clear();
    
    // Set up test membership data
    const testMembership = {
      id: 'test_membership_123',
      customerId: 'test_customer_456',
      status: 'active',
      startDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      benefits: {
        serviceDiscount: 0.15,
        freeDelivery: true,
        eligibleServices: ['massage', 'ems', 'yoga', 'supplements']
      }
    };
    
    localStorage.setItem('test-membership-data', JSON.stringify(testMembership));
  });
  
  console.log('✅ Test data setup complete');
}

async function setupAuthState(page: any) {
  // Set up authentication state for tests that require it
  console.log('🔐 Setting up authentication state...');
  
  // Mock authentication state
  await page.addInitScript(() => {
    const testCustomer = {
      id: 'test_customer_456',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+971501234567'
    };
    
    localStorage.setItem('test-customer-data', JSON.stringify(testCustomer));
  });
  
  console.log('✅ Authentication state setup complete');
}

export default globalSetup;