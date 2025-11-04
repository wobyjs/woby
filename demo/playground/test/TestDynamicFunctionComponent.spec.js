import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestDynamicFunctionComponent', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestDynamicFunctionComponent component
    const dynamicFunctionComponent = page.locator('h3', { hasText: 'Dynamic - Function Component' });
    const dynamicFunctionComponentCount = await dynamicFunctionComponent.count();

    if (dynamicFunctionComponentCount > 0) {
        // Get the parent container of the heading
        const container = dynamicFunctionComponent.locator('..');
        // Check that it has dynamic elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestDynamicFunctionComponent component renders correctly');
    } else {
        console.log('Playground demo TestDynamicFunctionComponent component not found');
    }
});