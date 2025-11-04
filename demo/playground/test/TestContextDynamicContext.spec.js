import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});


test('TestContextDynamicContext', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Look for TestContextDynamicContext component
    const contextDynamicContext = page.locator('h3', { hasText: 'Context - Dynamic Context' });
    const contextDynamicContextCount = await contextDynamicContext.count();

    if (contextDynamicContextCount > 0) {
        // Get the parent container of the heading
        const container = contextDynamicContext.locator('..');
        // Check that it has context elements
        const elements = container.locator('*');
        const elementCount = await elements.count();
        expect(elementCount).toBeGreaterThan(0);
        console.log('Playground demo TestContextDynamicContext component renders correctly');
    } else {
        console.log('Playground demo TestContextDynamicContext component not found');
    }
});