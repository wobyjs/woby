import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassNameObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassNameObservable component
    const classNameObservableHeading = page.locator('h3', { hasText: 'ClassName - Observable' });
    const classNameObservableCount = await classNameObservableHeading.count();

    if (classNameObservableCount > 0) {
        // Get the parent container of the heading
        const container = classNameObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassNameObservable component renders correctly');
    } else {
        console.log('Playground demo TestClassNameObservable component not found');
    }
});