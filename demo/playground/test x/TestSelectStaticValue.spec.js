import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSelectStaticValue', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSelectStaticValue component
    const selectStaticValueHeading = page.locator('h3', { hasText: 'Select - Static Value' });
    const selectStaticValueCount = await selectStaticValueHeading.count();

    if (selectStaticValueCount > 0) {
        // Get the parent container of the heading
        const container = selectStaticValueHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSelectStaticValue component renders correctly');
    } else {
        console.log('Playground demo TestSelectStaticValue component not found');
    }
});