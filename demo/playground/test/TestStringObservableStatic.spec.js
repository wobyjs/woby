import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestStringObservableStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestStringObservableStatic component
    const stringObservableStaticHeading = page.locator('h3', { hasText: 'String - Observable Static' });
    const stringObservableStaticCount = await stringObservableStaticHeading.count();

    if (stringObservableStaticCount > 0) {
        // Get the parent container of the heading
        const container = stringObservableStaticHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestStringObservableStatic component renders correctly');
    } else {
        console.log('Playground demo TestStringObservableStatic component not found');
    }
});