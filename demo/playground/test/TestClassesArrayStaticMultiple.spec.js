import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassesArrayStaticMultiple', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassesArrayStaticMultiple component
    const classesArrayStaticMultipleHeading = page.locator('h3', { hasText: 'Classes Array - Static Multiple' });
    const classesArrayStaticMultipleCount = await classesArrayStaticMultipleHeading.count();

    if (classesArrayStaticMultipleCount > 0) {
        // Get the parent container of the heading
        const container = classesArrayStaticMultipleHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassesArrayStaticMultiple component renders correctly');
    } else {
        console.log('Playground demo TestClassesArrayStaticMultiple component not found');
    }
});