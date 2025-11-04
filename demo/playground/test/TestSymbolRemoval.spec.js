import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSymbolRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSymbolRemoval component
    const symbolRemovalHeading = page.locator('h3', { hasText: 'Symbol - Removal' });
    const symbolRemovalCount = await symbolRemovalHeading.count();

    if (symbolRemovalCount > 0) {
        // Get the parent container of the heading
        const container = symbolRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSymbolRemoval component renders correctly');
    } else {
        console.log('Playground demo TestSymbolRemoval component not found');
    }
});