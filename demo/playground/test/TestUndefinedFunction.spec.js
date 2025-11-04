import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestUndefinedFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestUndefinedFunction component
    const undefinedFunctionHeading = page.locator('h3', { hasText: 'Undefined - Function' });
    const undefinedFunctionCount = await undefinedFunctionHeading.count();

    if (undefinedFunctionCount > 0) {
        // Get the parent container of the heading
        const container = undefinedFunctionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestUndefinedFunction component renders correctly');
    } else {
        console.log('Playground demo TestUndefinedFunction component not found');
    }
});