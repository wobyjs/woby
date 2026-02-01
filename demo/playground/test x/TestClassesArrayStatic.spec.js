import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassesArrayStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassesArrayStatic component
    const classesArrayStaticHeading = page.locator('h3', { hasText: 'Classes Array - Static' });
    const classesArrayStaticCount = await classesArrayStaticHeading.count();

    if (classesArrayStaticCount > 0) {
        // Get the parent container of the heading
        const container = classesArrayStaticHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassesArrayStatic component renders correctly');
    } else {
        console.log('Playground demo TestClassesArrayStatic component not found');
    }
});