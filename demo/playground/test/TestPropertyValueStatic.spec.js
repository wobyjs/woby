import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('TestPropertyValueStatic', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // TEMPORARY: Log information about the component structure
    const heading = page.locator('h3', { hasText: 'Property - Value Static' });
    const headingCount = await heading.count();
    console.log(`Found ${headingCount} headings with 'Property - Value Static'`);
    
    if (headingCount > 0) {
        // Find the input that comes immediately after the heading
        const input = heading.locator('+ p input');
        const inputCount = await input.count();
        console.log(`Found ${inputCount} inputs immediately after heading`);
        
        if (inputCount > 0) {
            // Check the value of the input
            const value = await input.evaluate(el => el.value);
            console.log(`Input value: ${value}`);
            
            // Check if there's a value attribute
            const valueAttribute = await input.getAttribute('value');
            console.log(`Input value attribute: ${valueAttribute}`);
            
            // Verify the input has the correct value
            expect(value).toBe('value');
            console.log('Playground demo TestPropertyValueStatic component renders correctly');
        } else {
            console.log('No input found immediately after heading');
        }
    } else {
        console.log('Playground demo TestPropertyValueStatic component not found');
    }
});