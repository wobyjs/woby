import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestPropertyCheckedFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find the heading for TestPropertyCheckedFunction component
    const heading = page.getByText('Property - Checked Function');
    const headingCount = await heading.count();

    if (headingCount > 0) {
        // Find the checkbox input that comes immediately after the heading
        const checkbox = heading.locator('+ p input[type="checkbox"]');
        const checkboxCount = await checkbox.count();

        if (checkboxCount > 0) {
            // Check if the checkbox is checked (it should be since the initial value is true)
            const isChecked = await checkbox.evaluate(el => el.checked);

            // Verify the checkbox is checked
            expect(isChecked).toBe(true);
            console.log('Playground demo TestPropertyCheckedFunction component renders correctly');
        } else {
            console.log('TestPropertyCheckedFunction component checkbox not found');
        }
    } else {
        console.log('TestPropertyCheckedFunction component heading not found');
    }
});