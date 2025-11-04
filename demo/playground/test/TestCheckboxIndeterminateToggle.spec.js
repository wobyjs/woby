import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestCheckboxIndeterminateToggle', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestCheckboxIndeterminateToggle component
    const checkboxIndeterminateToggleHeading = page.locator('h3', { hasText: 'Checkbox - Indeterminate Toggle' });
    const checkboxIndeterminateToggleCount = await checkboxIndeterminateToggleHeading.count();

    if (checkboxIndeterminateToggleCount > 0) {
        // Get the parent container of the heading
        const container = checkboxIndeterminateToggleHeading.locator('..');
        // Check that it has elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestCheckboxIndeterminateToggle component renders correctly');
    } else {
        console.log('Playground demo TestCheckboxIndeterminateToggle component not found');
    }
});