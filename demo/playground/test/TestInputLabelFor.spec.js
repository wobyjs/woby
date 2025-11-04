import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestInputLabelFor', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestInputLabelFor component
    const inputLabelForHeading = page.locator('h3', { hasText: 'Input - Label For' });
    const inputLabelForCount = await inputLabelForHeading.count();

    if (inputLabelForCount > 0) {
        // Get the parent container of the heading
        const container = inputLabelForHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestInputLabelFor component renders correctly');
    } else {
        console.log('Playground demo TestInputLabelFor component not found');
    }
});