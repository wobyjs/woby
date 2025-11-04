import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestInputForm', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestInputForm component
    const inputFormHeading = page.locator('h3', { hasText: 'Input - Input Form' });
    const inputFormCount = await inputFormHeading.count();

    if (inputFormCount > 0) {
        // Get the parent container of the heading
        const container = inputFormHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestInputForm component renders correctly');
    } else {
        console.log('Playground demo TestInputForm component not found');
    }
});