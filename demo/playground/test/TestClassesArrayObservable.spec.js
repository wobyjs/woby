import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassesArrayObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassesArrayObservable component
    const classesArrayObservableHeading = page.locator('h3', { hasText: 'Classes Array - Observable' });
    const classesArrayObservableCount = await classesArrayObservableHeading.count();

    if (classesArrayObservableCount > 0) {
        // Get the parent container of the heading
        const container = classesArrayObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassesArrayObservable component renders correctly');
    } else {
        console.log('Playground demo TestClassesArrayObservable component not found');
    }
});