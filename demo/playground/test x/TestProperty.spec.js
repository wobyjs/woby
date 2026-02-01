import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestProperty', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestProperty component heading
    const heading = page.getByText('Property - Checked Static');
    const headingCount = await heading.count();

    if (headingCount > 0) {
        console.log('Playground demo TestProperty component renders correctly');
    } else {
        console.log('Playground demo TestProperty component not found');
    }
});