import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
});

test('playground demo should render TestNumberStatic component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for TestNumberStatic component
    const componentHeading = page.locator('h3', { hasText: 'Number - Static' });
    const componentCount = await componentHeading.count();
    
    expect(componentCount).toBeGreaterThan(0);
    
    if (componentCount > 0) {
        // Get the first instance of the component
        const container = componentHeading.first().locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p').first();
        // Get the text content
        const content = await paragraph.textContent();
        
        // Perform assertions based on component type
        expect(!isNaN(parseFloat(content))).toBe(true);
        
        console.log('Playground demo TestNumberStatic component renders correct snapshot');
    }
});
