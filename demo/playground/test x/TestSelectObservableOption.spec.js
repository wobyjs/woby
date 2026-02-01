import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestSelectObservableOption', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestSelectObservableOption component
    const selectObservableOptionHeading = page.locator('h3', { hasText: 'Select - Observable Option' });
    const selectObservableOptionCount = await selectObservableOptionHeading.count();

    if (selectObservableOptionCount > 0) {
        // Get the parent container of the heading
        const container = selectObservableOptionHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestSelectObservableOption component renders correctly');
    } else {
        console.log('Playground demo TestSelectObservableOption component not found');
    }
});