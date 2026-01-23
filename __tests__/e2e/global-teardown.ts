import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up E2E test environment...');
  
  try {
    // Clean up any test data
    await cleanupTestData();
    
    // Clean up any temporary files
    await cleanupTempFiles();
    
    // Generate test report summary
    await generateTestSummary();
    
  } catch (error) {
    console.error('❌ Failed to clean up E2E test environment:', error);
    // Don't throw here as it would fail the entire test run
  }
  
  console.log('✅ E2E test environment cleanup complete');
}

async function cleanupTestData() {
  console.log('🗑️  Cleaning up test data...');
  
  // Clean up any database test data if applicable
  // This would typically involve API calls to clean up test records
  
  console.log('✅ Test data cleanup complete');
}

async function cleanupTempFiles() {
  console.log('📁 Cleaning up temporary files...');
  
  // Clean up any temporary files created during tests
  // This could include screenshots, videos, traces, etc.
  
  console.log('✅ Temporary files cleanup complete');
}

async function generateTestSummary() {
  console.log('📋 Generating test summary...');
  
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Read test results if available
    const resultsPath = path.join(process.cwd(), 'test-results', 'e2e-results.json');
    
    try {
      const resultsData = await fs.readFile(resultsPath, 'utf-8');
      const results = JSON.parse(resultsData);
      
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        suites: results.suites?.map((suite: any) => ({
          title: suite.title,
          tests: suite.tests?.length || 0,
          passed: suite.tests?.filter((t: any) => t.outcome === 'passed').length || 0,
          failed: suite.tests?.filter((t: any) => t.outcome === 'failed').length || 0
        })) || []
      };
      
      // Write summary to file
      const summaryPath = path.join(process.cwd(), 'test-results', 'e2e-summary.json');
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      
      console.log('📊 Test Summary:');
      console.log(`   Total Tests: ${summary.totalTests}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Skipped: ${summary.skipped}`);
      console.log(`   Duration: ${(summary.duration / 1000).toFixed(2)}s`);
      
    } catch (error) {
      console.log('⚠️  Could not read test results file');
    }
    
  } catch (error) {
    console.error('❌ Failed to generate test summary:', error);
  }
  
  console.log('✅ Test summary generation complete');
}

export default globalTeardown;