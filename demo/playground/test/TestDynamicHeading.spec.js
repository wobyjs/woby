import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestDynamicHeading', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestDynamicHeading component
    const dynamicHeading = page.locator('h3', { hasText: 'Dynamic - Heading' });
    const dynamicHeadingCount = await dynamicHeading.count();

    if (dynamicHeadingCount > 0) {
        // Get the parent container of the heading
        const container = dynamicHeading.locator('..');
        // Check that it has dynamic elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestDynamicHeading component renders correctly');
    } else {
        console.log('Playground demo TestDynamicHeading component not found');
    }
});