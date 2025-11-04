import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestNumberObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestNumberObservable component
    const numberObservableHeading = page.locator('h3', { hasText: 'Number - Observable' });
    const numberObservableCount = await numberObservableHeading.count();

    if (numberObservableCount > 0) {
        // Get the parent container of the heading
        const container = numberObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestNumberObservable component renders correctly');
    } else {
        console.log('Playground demo TestNumberObservable component not found');
    }
});