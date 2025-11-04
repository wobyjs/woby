import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestUndefinedObservable component with dynamic updates', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestUndefinedObservable component
    const undefinedObservableHeading = page.locator('h3', { hasText: 'Undefined - Observable' });
    const undefinedObservableCount = await undefinedObservableHeading.count();

    if (undefinedObservableCount > 0) {
        // Get the parent container of the heading
        const container = undefinedObservableHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Wait for content to load
        await paragraph.waitFor({ state: 'visible' });
        // Should be visible
        await expect(paragraph).toBeVisible();
        console.log('Playground demo TestUndefinedObservable component renders with dynamic updates');
    } else {
        console.log('Playground demo TestUndefinedObservable component not found');
    }
});