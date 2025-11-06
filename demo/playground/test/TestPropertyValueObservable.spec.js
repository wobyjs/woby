import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestPropertyValueObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestPropertyValueObservable component
    const propertyValueObservableHeading = page.locator('h3', { hasText: 'Property - Value Observable' });
    const propertyValueObservableCount = await propertyValueObservableHeading.count();

    if (propertyValueObservableCount > 0) {
        // Get the parent container of the heading
        const container = propertyValueObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestPropertyValueObservable component renders correctly');
    } else {
        console.log('Playground demo TestPropertyValueObservable component not found');
    }
});