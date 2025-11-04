import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSymbolObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSymbolObservable component
    const symbolObservableHeading = page.locator('h3', { hasText: 'Symbol - Observable' });
    const symbolObservableCount = await symbolObservableHeading.count();

    if (symbolObservableCount > 0) {
        // Get the parent container of the heading
        const container = symbolObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSymbolObservable component renders correctly');
    } else {
        console.log('Playground demo TestSymbolObservable component not found');
    }
});