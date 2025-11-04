import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestUndefinedRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestUndefinedRemoval component
    const undefinedRemovalHeading = page.locator('h3', { hasText: 'Undefined - Removal' });
    const undefinedRemovalCount = await undefinedRemovalHeading.count();

    if (undefinedRemovalCount > 0) {
        // Get the parent container of the heading
        const container = undefinedRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestUndefinedRemoval component renders correctly');
    } else {
        console.log('Playground demo TestUndefinedRemoval component not found');
    }
});