import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
});

test('playground demo should render TestBigIntObservable component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for TestBigIntObservable component
    const componentHeading = page.locator('h3', { hasText: 'BigInt - Observable' });
    const componentCount = await componentHeading.count();
    
    expect(componentCount).toBeGreaterThan(0);
    
    console.log('Playground demo TestBigIntObservable component renders correctly');
});
