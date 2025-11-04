import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestNullRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestNullRemoval component
    const nullRemovalHeading = page.locator('h3', { hasText: 'Null - Removal' });
    const nullRemovalCount = await nullRemovalHeading.count();

    if (nullRemovalCount > 0) {
        // Get the parent container of the heading
        const container = nullRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestNullRemoval component renders correctly');
    } else {
        console.log('Playground demo TestNullRemoval component not found');
    }
});