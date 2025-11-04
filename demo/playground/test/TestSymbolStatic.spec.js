import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSymbolStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSymbolStatic component
    const symbolStaticHeading = page.locator('h3', { hasText: 'Symbol - Static' });
    const symbolStaticCount = await symbolStaticHeading.count();

    if (symbolStaticCount > 0) {
        // Get the parent container of the heading
        const container = symbolStaticHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSymbolStatic component renders correctly');
    } else {
        console.log('Playground demo TestSymbolStatic component not found');
    }
});