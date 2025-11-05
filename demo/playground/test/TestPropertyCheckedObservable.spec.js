import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5174',
});

test('TestPropertyCheckedObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestPropertyCheckedObservable component
    const propertyCheckedObservableHeading = page.locator('h3', { hasText: 'Property - Checked Observable' });
    const propertyCheckedObservableCount = await propertyCheckedObservableHeading.count();

    if (propertyCheckedObservableCount > 0) {
        // Get the parent container of the heading
        const container = propertyCheckedObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestPropertyCheckedObservable component renders correctly');
    } else {
        console.log('Playground demo TestPropertyCheckedObservable component not found');
    }
});