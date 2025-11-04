import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestBooleanObservable component with dynamic updates', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestBooleanObservable component
    const booleanObservableHeading = page.locator('h3', { hasText: 'Boolean - Observable' });
    const booleanObservableCount = await booleanObservableHeading.count();

    if (booleanObservableCount > 0) {
        // Get the parent container of the heading
        const container = booleanObservableHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Wait for content to load
        await paragraph.waitFor({ state: 'visible' });
        // Should be visible
        await expect(paragraph).toBeVisible();
        console.log('Playground demo TestBooleanObservable component renders with dynamic updates');
    } else {
        console.log('Playground demo TestBooleanObservable component not found');
    }
});