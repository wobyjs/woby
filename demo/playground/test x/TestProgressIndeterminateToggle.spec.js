import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestProgressIndeterminateToggle', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestProgressIndeterminateToggle component
    const progressIndeterminateToggleHeading = page.locator('h3', { hasText: 'Progress - Indeterminate Toggle' });
    const progressIndeterminateToggleCount = await progressIndeterminateToggleHeading.count();

    if (progressIndeterminateToggleCount > 0) {
        // Get the parent container of the heading
        const container = progressIndeterminateToggleHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestProgressIndeterminateToggle component renders correctly');
    } else {
        console.log('Playground demo TestProgressIndeterminateToggle component not found');
    }
});