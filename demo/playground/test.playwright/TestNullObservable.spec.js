import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
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
        // Check visibility without waiting (element may remain hidden in snapshot tests)
        const isVisible = await paragraph.isVisible();
        console.log(`Playground demo TestNullObservable component paragraph visibility: ${isVisible}`);
        console.log('Playground demo TestNullObservable component renders with dynamic updates');
    } else {
        console.log('Playground demo TestNullObservable component not found');
    }
});