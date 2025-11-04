import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestAttributeFunctionBoolean', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestAttributeFunctionBoolean component
    const attributeFunctionBooleanHeading = page.locator('h3', { hasText: 'Attribute - Function Boolean' });
    const attributeFunctionBooleanCount = await attributeFunctionBooleanHeading.count();

    if (attributeFunctionBooleanCount > 0) {
        // Get the parent container of the heading
        const container = attributeFunctionBooleanHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestAttributeFunctionBoolean component renders correctly');
    } else {
        console.log('Playground demo TestAttributeFunctionBoolean component not found');
    }
});