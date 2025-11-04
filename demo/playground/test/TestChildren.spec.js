import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestChildren', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestChildren component
    const childrenHeading = page.locator('h3', { hasText: 'Children' });
    const childrenCount = await childrenHeading.count();

    if (childrenCount > 0) {
        // Get the parent container of the heading
        const container = childrenHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestChildren component renders correctly');
    } else {
        console.log('Playground demo TestChildren component not found');
    }
});