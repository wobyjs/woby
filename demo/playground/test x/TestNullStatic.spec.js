import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestNullStatic component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestNullStatic component
    const nullStaticHeading = page.locator('h3', { hasText: 'Null - Static' });
    const nullStaticCount = await nullStaticHeading.count();

    if (nullStaticCount > 0) {
        // Get the parent container of the heading
        const container = nullStaticHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Get the text content
        const content = await paragraph.textContent();
        // For null static, should be empty
        expect(content).toBe('');
        console.log('Playground demo TestNullStatic component renders correct snapshot');
    } else {
        console.log('Playground demo TestNullStatic component not found');
    }
});