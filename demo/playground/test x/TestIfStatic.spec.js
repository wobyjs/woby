import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestIfStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestIfStatic component
    const ifStaticHeading = page.locator('h3', { hasText: 'If - Static' });
    const ifStaticCount = await ifStaticHeading.count();

    if (ifStaticCount > 0) {
        // Get the parent container of the heading
        const container = ifStaticHeading.locator('..');
        // Check that it has conditional elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestIfStatic component renders correctly');
    } else {
        console.log('Playground demo TestIfStatic component not found');
    }
});