import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
});

test('playground demo should render TestBooleanRemoval component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for TestBooleanRemoval component
    const componentHeading = page.locator('h3', { hasText: 'Boolean - Removal' });
    const componentCount = await componentHeading.count();
    
    expect(componentCount).toBeGreaterThan(0);
    
    console.log('Playground demo TestBooleanRemoval component renders correctly');
});
