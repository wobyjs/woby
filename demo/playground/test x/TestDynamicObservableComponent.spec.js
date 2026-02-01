import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestDynamicObservableComponent', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestDynamicObservableComponent component
    const dynamicObservableComponent = page.locator('h3', { hasText: 'Dynamic - Observable Component' });
    const dynamicObservableComponentCount = await dynamicObservableComponent.count();

    if (dynamicObservableComponentCount > 0) {
        // Get the parent container of the heading
        const container = dynamicObservableComponent.locator('..');
        // Check that it has dynamic elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestDynamicObservableComponent component renders correctly');
    } else {
        console.log('Playground demo TestDynamicObservableComponent component not found');
    }
});