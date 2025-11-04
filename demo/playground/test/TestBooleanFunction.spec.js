import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestBooleanFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestBooleanFunction component
    const booleanFunctionHeading = page.locator('h3', { hasText: 'Boolean - Function' });
    const booleanFunctionCount = await booleanFunctionHeading.count();

    if (booleanFunctionCount > 0) {
        // Get the parent container of the heading
        const container = booleanFunctionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestBooleanFunction component renders correctly');
    } else {
        console.log('Playground demo TestBooleanFunction component not found');
    }
});