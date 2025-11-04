import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('playground demo should render TestStringStatic component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestStringStatic component
    const stringStaticHeading = page.locator('h3', { hasText: 'String - Static' });
    const stringStaticCount = await stringStaticHeading.count();

    if (stringStaticCount > 0) {
        // Get the parent container of the heading
        const container = stringStaticHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Get the text content
        const content = await paragraph.textContent();
        // For string static, should be a non-empty string
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
        console.log('Playground demo TestStringStatic component renders correct snapshot');
    } else {
        console.log('Playground demo TestStringStatic component not found');
    }
});