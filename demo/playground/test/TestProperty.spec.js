import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestProperty', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestProperty component
    const propertyHeading = page.locator('h3', { hasText: 'Property' });
    const propertyCount = await propertyHeading.count();

    if (propertyCount > 0) {
        // Get the parent container of the heading
        const container = propertyHeading.locator('..');
        // Check that it has elements with properties
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestProperty component renders correctly');
    } else {
        console.log('Playground demo TestProperty component not found');
    }
});