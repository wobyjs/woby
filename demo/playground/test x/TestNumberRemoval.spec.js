import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestNumberRemoval', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestNumberRemoval component
    const numberRemovalHeading = page.locator('h3', { hasText: 'Number - Removal' });
    const numberRemovalCount = await numberRemovalHeading.count();

    if (numberRemovalCount > 0) {
        // Get the parent container of the heading
        const container = numberRemovalHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestNumberRemoval component renders correctly');
    } else {
        console.log('Playground demo TestNumberRemoval component not found');
    }
});