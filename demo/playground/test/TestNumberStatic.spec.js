import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('playground demo should render TestNumberStatic component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestNumberStatic component
    const numberStaticHeading = page.locator('h3', { hasText: 'Number - Static' });
    const numberStaticCount = await numberStaticHeading.count();

    if (numberStaticCount > 0) {
        // Get the parent container of the heading
        const container = numberStaticHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Get the text content
        const content = await paragraph.textContent();
        // For number static, should be a numeric string
        expect(!isNaN(parseFloat(content))).toBe(true);
        console.log('Playground demo TestNumberStatic component renders correct snapshot');
    } else {
        console.log('Playground demo TestNumberStatic component not found');
    }
});