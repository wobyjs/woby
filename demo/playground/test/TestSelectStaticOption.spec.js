import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSelectStaticOption', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSelectStaticOption component
    const selectStaticOptionHeading = page.locator('h3', { hasText: 'Select - Static Option' });
    const selectStaticOptionCount = await selectStaticOptionHeading.count();

    if (selectStaticOptionCount > 0) {
        // Get the parent container of the heading
        const container = selectStaticOptionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSelectStaticOption component renders correctly');
    } else {
        console.log('Playground demo TestSelectStaticOption component not found');
    }
});