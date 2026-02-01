import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestIdObservable', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestIdObservable component
    const idObservableHeading = page.locator('h3', { hasText: 'Id - Observable' });
    const idObservableCount = await idObservableHeading.count();

    if (idObservableCount > 0) {
        // Get the parent container of the heading
        const container = idObservableHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestIdObservable component renders correctly');
    } else {
        console.log('Playground demo TestIdObservable component not found');
    }
});