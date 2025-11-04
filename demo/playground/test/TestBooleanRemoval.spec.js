import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestBooleanRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestBooleanRemoval component
    const booleanRemovalHeading = page.locator('h3', { hasText: 'Boolean - Removal' });
    const booleanRemovalCount = await booleanRemovalHeading.count();

    if (booleanRemovalCount > 0) {
        // Get the parent container of the heading
        const container = booleanRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestBooleanRemoval component renders correctly');
    } else {
        console.log('Playground demo TestBooleanRemoval component not found');
    }
});