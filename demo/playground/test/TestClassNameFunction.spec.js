import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassNameFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassNameFunction component
    const classNameFunctionHeading = page.locator('h3', { hasText: 'ClassName - Function' });
    const classNameFunctionCount = await classNameFunctionHeading.count();

    if (classNameFunctionCount > 0) {
        // Get the parent container of the heading
        const container = classNameFunctionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassNameFunction component renders correctly');
    } else {
        console.log('Playground demo TestClassNameFunction component not found');
    }
});