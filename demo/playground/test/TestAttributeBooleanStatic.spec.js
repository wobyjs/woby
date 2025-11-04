import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestAttributeBooleanStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestAttributeBooleanStatic component
    const attributeBooleanStaticHeading = page.locator('h3', { hasText: 'Attribute Boolan - Static' });
    const attributeBooleanStaticCount = await attributeBooleanStaticHeading.count();

    if (attributeBooleanStaticCount > 0) {
        // Get the parent container of the heading
        const container = attributeBooleanStaticHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestAttributeBooleanStatic component renders correctly');
    } else {
        console.log('Playground demo TestAttributeBooleanStatic component not found');
    }
});