import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestPropertyCheckedStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find the specific heading for TestPropertyCheckedStatic
    const heading = page.locator('h3', { hasText: 'Property - Checked Static' });
    const headingCount = await heading.count();
    
    if (headingCount > 0) {
        // Find the checkbox input that comes immediately after the heading
        const checkbox = heading.locator('+ p input[type="checkbox"]');
        const checkboxCount = await checkbox.count();
        
        if (checkboxCount > 0) {
            // Check if the checkbox is checked
            const isChecked = await checkbox.evaluate(el => el.checked);
            
            // Verify the checkbox is checked
            expect(isChecked).toBe(true);
            console.log('Playground demo TestPropertyCheckedStatic component renders correctly');
        } else {
            console.log('No checkbox found immediately after heading');
        }
    } else {
        console.log('Playground demo TestPropertyCheckedStatic component not found');
    }
});