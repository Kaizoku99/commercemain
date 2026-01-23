# ATP Membership System - Comprehensive Testing Suite

This directory contains a comprehensive testing suite for the ATP Membership System, covering all aspects of quality assurance including unit tests, integration tests, performance tests, accessibility tests, load tests, and end-to-end tests.

## Test Structure

```
__tests__/
├── __mocks__/                    # Mock data and test utilities
│   ├── membership-data.ts        # Mock membership data
│   └── test-providers.tsx        # React testing providers
├── accessibility/                # Accessibility compliance tests
│   └── membership-components.test.tsx
├── components/                   # Component unit tests
├── config/                       # Test configuration
│   └── test-config.ts
├── e2e/                         # End-to-end tests
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   └── membership-signup-flow.test.ts
├── hooks/                       # Hook unit tests
├── load/                        # Load and stress tests
│   └── membership-api-load.test.ts
├── performance/                 # Performance tests
│   └── discount-calculation.test.ts
└── services/                    # Service layer tests
```

## Test Categories

### 1. End-to-End Tests (`e2e/`)

Tests the complete user journey from membership signup to renewal.

**Coverage:**
- Complete membership signup flow
- Payment processing integration
- Error handling scenarios
- Multi-language support (Arabic/English)
- Mobile and desktop responsiveness

**Tools:** Playwright, Chromium, Firefox, WebKit

**Run Command:**
```bash
npm run test:e2e
# or
playwright test
```

### 2. Performance Tests (`performance/`)

Validates system performance under various conditions.

**Coverage:**
- Discount calculation performance (target: <0.01ms per calculation)
- Bulk operations efficiency
- Memory usage optimization
- Concurrent operation handling

**Thresholds:**
- Discount calculations: 100,000+ operations/second
- Memory increase: <10MB for 50,000 operations
- Bulk processing: <10ms for 100 items

**Run Command:**
```bash
npm run test:performance
```

### 3. Accessibility Tests (`accessibility/`)

Ensures WCAG 2.1 AA compliance for all membership components.

**Coverage:**
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA labels and roles
- RTL (Arabic) layout support

**Standards:** WCAG 2.1 AA, Section 508

**Run Command:**
```bash
npm run test:accessibility
```

### 4. Load Tests (`load/`)

Tests system behavior under high load conditions.

**Coverage:**
- Concurrent membership creation (100+ requests)
- High-frequency lookups (1000+ requests)
- API error handling under load
- Memory stability during sustained load

**Thresholds:**
- Membership creation: 50+ requests/second
- Membership lookup: 200+ requests/second
- Success rate: >95% under normal load, >80% with errors

**Run Command:**
```bash
npm run test:load
```

## Test Configuration

### Environment Variables

```bash
# Test environment
NODE_ENV=test
CI=true

# Application URL for E2E tests
TEST_BASE_URL=http://localhost:3000

# Shopify test credentials (if needed)
SHOPIFY_STORE_DOMAIN=test-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=test_token
```

### Performance Thresholds

The test suite enforces the following performance thresholds:

| Operation | Threshold | Measurement |
|-----------|-----------|-------------|
| Discount Calculation | <0.01ms | Per calculation |
| Membership Validation | <0.01ms | Per validation |
| Bulk Operations | <10ms | Per 100 items |
| API Requests | <100ms | Average response time |
| Memory Usage | <10MB | Increase per 50k operations |

### Accessibility Standards

All components must pass:
- WCAG 2.1 AA compliance
- Color contrast ratio ≥4.5:1
- Keyboard navigation support
- Screen reader compatibility
- RTL layout support for Arabic

## Running Tests

### All Tests
```bash
# Run comprehensive test suite
npm run test:all

# Run with coverage
npm run test:coverage
```

### Individual Test Suites
```bash
# Unit tests
npm run test:unit

# Component tests
npm run test:components

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:accessibility

# Load tests
npm run test:load

# E2E tests
npm run test:e2e
```

### Continuous Integration

The test suite is designed for CI/CD environments:

```bash
# CI test command
npm run test:ci

# Generate reports
npm run test:reports
```

## Test Data

### Mock Data

The test suite uses comprehensive mock data located in `__mocks__/`:

- `mockMembership`: Active membership data
- `mockExpiredMembership`: Expired membership data
- `mockCustomer`: Shopify customer data
- `mockProducts`: Service and product data
- `mockApiResponses`: Shopify API responses

### Test Scenarios

1. **Happy Path**: Successful membership signup and usage
2. **Error Handling**: API failures, network issues, validation errors
3. **Edge Cases**: Expired memberships, cancelled subscriptions
4. **Performance**: High load, concurrent operations
5. **Accessibility**: Screen readers, keyboard navigation, RTL

## Quality Gates

The test suite enforces quality gates:

### Critical Tests (Must Pass)
- Unit tests: >90% pass rate
- Component tests: >95% pass rate
- Accessibility tests: 100% pass rate
- E2E tests: >90% pass rate

### Non-Critical Tests (Warnings Only)
- Performance tests: Threshold warnings
- Load tests: Capacity warnings

### Coverage Requirements
- Line coverage: >80%
- Branch coverage: >80%
- Function coverage: >80%

## Debugging Tests

### Debug Individual Tests
```bash
# Debug specific test file
npm run test:debug __tests__/components/membership-signup.test.tsx

# Debug with browser
npm run test:debug:browser
```

### Test Artifacts

Test runs generate artifacts in `test-results/`:
- Screenshots (on failure)
- Videos (on failure)
- Trace files (on retry)
- Coverage reports
- Performance metrics

## Best Practices

### Writing Tests

1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Follow AAA pattern
3. **Mock External Dependencies**: Use mocks for API calls
4. **Test Edge Cases**: Include error scenarios
5. **Performance Considerations**: Set appropriate timeouts

### Test Maintenance

1. **Regular Updates**: Keep tests updated with code changes
2. **Mock Data**: Update mock data to reflect real scenarios
3. **Performance Baselines**: Review and update performance thresholds
4. **Accessibility Standards**: Stay current with WCAG updates

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase timeout values for slow operations
2. **Mock Failures**: Verify mock data matches API responses
3. **Accessibility Violations**: Check ARIA labels and color contrast
4. **Performance Degradation**: Profile code for bottlenecks

### Getting Help

1. Check test logs in `test-results/`
2. Review mock data in `__mocks__/`
3. Verify test configuration in `config/`
4. Run individual test suites to isolate issues

## Reporting

### Test Reports

Generated reports include:
- HTML coverage report
- JSON test results
- Performance metrics
- Accessibility audit results
- Load test summaries

### Metrics Dashboard

Key metrics tracked:
- Test execution time
- Coverage percentages
- Performance benchmarks
- Accessibility compliance
- Error rates

## Contributing

When adding new features:

1. Add corresponding unit tests
2. Update component tests if UI changes
3. Add performance tests for new calculations
4. Verify accessibility compliance
5. Update E2E tests for new user flows

### Test Review Checklist

- [ ] All test categories covered
- [ ] Performance thresholds met
- [ ] Accessibility standards complied
- [ ] Error scenarios tested
- [ ] Mock data updated
- [ ] Documentation updated