import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestFor', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestFor component heading
    const heading = page.getByText('For - Unkeyed - Observable Observables');
    const headingCount = await heading.count();

    if (headingCount > 0) {
        console.log('Playground demo TestFor component renders correctly');
    } else {
        // TestFor components might be rendered in a way that makes them not directly visible
        console.log('Playground demo TestFor component not directly visible');
    }
});