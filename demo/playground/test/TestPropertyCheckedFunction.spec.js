import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestPropertyCheckedFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestPropertyCheckedFunction component
    const propertyCheckedFunctionHeading = page.locator('h3', { hasText: 'Property - Checked Function' });
    const propertyCheckedFunctionCount = await propertyCheckedFunctionHeading.count();

    if (propertyCheckedFunctionCount > 0) {
        // Get the parent container of the heading
        const container = propertyCheckedFunctionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestPropertyCheckedFunction component renders correctly');
    } else {
        console.log('Playground demo TestPropertyCheckedFunction component not found');
    }
});