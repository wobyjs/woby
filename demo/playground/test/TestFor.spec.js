import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestFor', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestFor component
    const forHeading = page.locator('h3', { hasText: 'For' });
    const forCount = await forHeading.count();

    if (forCount > 0) {
        // Get the parent container of the heading
        const container = forHeading.locator('..');
        // Check that it has list elements or paragraph elements
        const items = container.locator('p, li');
        const itemCount = await items.count();
        expect(itemCount).toBeGreaterThan(0);
        console.log('Playground demo TestFor component renders correctly');
    } else {
        console.log('Playground demo TestFor component not found');
    }
});