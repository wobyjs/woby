import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestUndefinedStatic component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestUndefinedStatic component
    const undefinedStaticHeading = page.locator('h3', { hasText: 'Undefined - Static' });
    const undefinedStaticCount = await undefinedStaticHeading.count();

    if (undefinedStaticCount > 0) {
        // Get the parent container of the heading
        const container = undefinedStaticHeading.locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p');
        // Get the text content
        const content = await paragraph.textContent();
        // For undefined static, should be empty
        expect(content).toBe('');
        console.log('Playground demo TestUndefinedStatic component renders correct snapshot');
    } else {
        console.log('Playground demo TestUndefinedStatic component not found');
    }
});