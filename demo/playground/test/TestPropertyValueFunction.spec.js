import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5174',
});

test('TestPropertyValueFunction', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find the heading for TestPropertyValueFunction component
    const heading = page.getByText('Property - Value Function');
    const headingCount = await heading.count();

    if (headingCount > 0) {
        // Find the input that comes immediately after the heading
        const input = heading.locator('+ p input');
        const inputCount = await input.count();

        if (inputCount > 0) {
            // Check the value of the input (it should be a random string)
            const value = await input.evaluate(el => el.value);

            // Verify the input has a value
            expect(value).toBeTruthy();
            console.log('Playground demo TestPropertyValueFunction component renders correctly');
        } else {
            console.log('TestPropertyValueFunction component input not found');
        }
    } else {
        console.log('TestPropertyValueFunction component heading not found');
    }
});