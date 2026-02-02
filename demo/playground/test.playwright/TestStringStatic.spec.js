import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
});

test('playground demo should render TestStringStatic component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for TestStringStatic component
    const componentHeading = page.locator('h3', { hasText: 'String - Static' });
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
        expect(content).toBe('string');
        
        console.log('Playground demo TestStringStatic component renders correct snapshot');
    }
});
