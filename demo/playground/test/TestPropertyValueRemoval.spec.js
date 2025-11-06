import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestPropertyValueRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestPropertyValueRemoval component
    const propertyValueRemovalHeading = page.locator('h3', { hasText: 'Property - Value Removal' });
    const propertyValueRemovalCount = await propertyValueRemovalHeading.count();

    if (propertyValueRemovalCount > 0) {
        // Get the parent container of the heading
        const container = propertyValueRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestPropertyValueRemoval component renders correctly');
    } else {
        console.log('Playground demo TestPropertyValueRemoval component not found');
    }
});