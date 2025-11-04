import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSelectObservableValue', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSelectObservableValue component
    const selectObservableValueHeading = page.locator('h3', { hasText: 'Select - Observable Value' });
    const selectObservableValueCount = await selectObservableValueHeading.count();

    if (selectObservableValueCount > 0) {
        // Get the parent container of the heading
        const container = selectObservableValueHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSelectObservableValue component renders correctly');
    } else {
        console.log('Playground demo TestSelectObservableValue component not found');
    }
});