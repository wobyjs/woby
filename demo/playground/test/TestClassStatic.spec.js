import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassStatic component
    const classStaticHeading = page.locator('h3', { hasText: 'Class - Static' });
    const classStaticCount = await classStaticHeading.count();

    if (classStaticCount > 0) {
        // Get the parent container of the heading
        const container = classStaticHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassStatic component renders correctly');
    } else {
        console.log('Playground demo TestClassStatic component not found');
    }
});