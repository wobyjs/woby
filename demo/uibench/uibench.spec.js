import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('uibench demo should load successfully', async ({ page }) => {
    // Navigate to the uibench demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('UI Bench');

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible();

    console.log('UIBench demo loaded successfully');
});

test('uibench demo should display main container', async ({ page }) => {
    // Navigate to the uibench demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that main container exists
    const mainContainer = page.locator('div.container');
    await expect(mainContainer).toBeVisible();

    console.log('UIBench demo has visible main container');
});

test('uibench demo should have proper document structure', async ({ page }) => {
    // Navigate to the uibench demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that document has proper structure
    const html = page.locator('html');
    const head = page.locator('head');
    const body = page.locator('body');

    await expect(html).toBeVisible();
    await expect(head).toBeVisible();
    await expect(body).toBeVisible();

    // Check that body contains the app
    await expect(body.locator('#app')).toBeVisible();

    console.log('UIBench demo has proper document structure');
});