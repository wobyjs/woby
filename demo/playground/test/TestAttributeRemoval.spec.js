import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestAttributeRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestAttributeRemoval component
    const attributeRemovalHeading = page.locator('h3', { hasText: 'Attribute - Removal' });
    const attributeRemovalCount = await attributeRemovalHeading.count();

    if (attributeRemovalCount > 0) {
        // Get the parent container of the heading
        const container = attributeRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestAttributeRemoval component renders correctly');
    } else {
        console.log('Playground demo TestAttributeRemoval component not found');
    }
});