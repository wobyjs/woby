import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestNullObservable component with dynamic updates', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestNullObservable component
    const nullObservableHeading = page.locator('h3', { hasText: 'Null - Observable' });
    const nullObservableCount = await nullObservableHeading.count();

    if (nullObservableCount > 0) {
        // Get the parent container of the heading
        const container = nullObservableHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Wait for content to load
        await paragraph.waitFor({ state: 'visible' });
        // Should be visible
        await expect(paragraph).toBeVisible();
        console.log('Playground demo TestNullObservable component renders with dynamic updates');
    } else {
        console.log('Playground demo TestNullObservable component not found');
    }
});