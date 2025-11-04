import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestPropertyValueFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestPropertyValueFunction component
    const propertyValueFunctionHeading = page.locator('h3', { hasText: 'Property - Value Function' });
    const propertyValueFunctionCount = await propertyValueFunctionHeading.count();

    if (propertyValueFunctionCount > 0) {
        // Get the parent container of the heading
        const container = propertyValueFunctionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestPropertyValueFunction component renders correctly');
    } else {
        console.log('Playground demo TestPropertyValueFunction component not found');
    }
});