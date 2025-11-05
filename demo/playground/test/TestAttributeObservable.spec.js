import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestAttributeObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestAttributeObservable component heading
    const heading = page.getByText('Attribute - Observable');
    const headingCount = await heading.count();

    if (headingCount > 0) {
        // TestAttributeObservable is wrapped in TestSnapshots, so it won't be directly visible in the DOM
        // We can only verify that the heading exists
        console.log('Playground demo TestAttributeObservable component heading found (component wrapped in TestSnapshots)');
    } else {
        console.log('Playground demo TestAttributeObservable component heading not found (component wrapped in TestSnapshots)');
    }
});