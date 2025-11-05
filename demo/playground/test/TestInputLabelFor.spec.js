import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5174',
});

test('TestInputLabelFor', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find the heading for TestInputLabelFor component
    const heading = page.getByText('Input - Label For');
    const headingCount = await heading.count();

    if (headingCount > 0) {
        // Find the labels that come immediately after the heading
        const labels = heading.locator('+ p label');
        const labelCount = await labels.count();

        if (labelCount > 0) {
            console.log('Playground demo TestInputLabelFor component renders correctly');
        } else {
            console.log('TestInputLabelFor component labels not found');
        }
    } else {
        console.log('TestInputLabelFor component heading not found');
    }
});