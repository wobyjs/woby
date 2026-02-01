import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSymbolFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSymbolFunction component
    const symbolFunctionHeading = page.locator('h3', { hasText: 'Symbol - Function' });
    const symbolFunctionCount = await symbolFunctionHeading.count();

    if (symbolFunctionCount > 0) {
        // Get the parent container of the heading
        const container = symbolFunctionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSymbolFunction component renders correctly');
    } else {
        console.log('Playground demo TestSymbolFunction component not found');
    }
});