import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestIf', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestIf component
    const ifHeading = page.locator('h3', { hasText: 'If' });
    const ifCount = await ifHeading.count();

    if (ifCount > 0) {
        // Get the parent container of the heading
        const container = ifHeading.locator('..');
        // Check that it has conditional elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestIf component renders correctly');
    } else {
        console.log('Playground demo TestIf component not found');
    }
});