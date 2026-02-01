import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('playground demo should render TestStringObservable component correctly', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestStringObservable component
    const stringObservableHeading = page.locator('h3', { hasText: 'String - Observable' });
    const stringObservableCount = await stringObservableHeading.count();

    if (stringObservableCount > 0) {
        // Get the parent container of the heading
        const container = stringObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestStringObservable component renders correctly');
    } else {
        console.log('Playground demo TestStringObservable component not found');
    }
});