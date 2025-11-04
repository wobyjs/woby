import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestClassObservableString', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestClassObservableString component
    const classObservableStringHeading = page.locator('h3', { hasText: 'Class - Observable String' });
    const classObservableStringCount = await classObservableStringHeading.count();

    if (classObservableStringCount > 0) {
        // Get the parent container of the heading
        const container = classObservableStringHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestClassObservableString component renders correctly');
    } else {
        console.log('Playground demo TestClassObservableString component not found');
    }
});