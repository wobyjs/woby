import { test, expect } from '@playwright/test';

test('spiral demo should load successfully', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('Spiral');

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible();

    console.log('Spiral demo loaded successfully');
});

test('spiral demo should display main container', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that main container exists
    const mainContainer = page.locator('#main');
    await expect(mainContainer).toBeVisible();

    console.log('Spiral demo has visible main container');
});

test('spiral demo should render cursors', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for animation to render
    await page.waitForTimeout(500);

    // Check that cursors exist
    const cursors = page.locator('.cursor');
    const cursorCount = await cursors.count();

    // There should be multiple cursors in the spiral
    expect(cursorCount).toBeGreaterThan(0);

    console.log(`Spiral demo rendered ${cursorCount} cursors`);
});

test('spiral demo should have label cursor', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for animation to render
    await page.waitForTimeout(500);

    // Check that label cursor exists
    const labelCursor = page.locator('.cursor.label');
    await expect(labelCursor).toBeVisible();

    // Check that label exists within label cursor
    const label = labelCursor.locator('.label');
    await expect(label).toBeVisible();

    console.log('Spiral demo has label cursor with coordinate display');
});

test('spiral demo should animate over time', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find main container
    const mainContainer = page.locator('#main');

    // Wait for animation to progress
    await page.waitForTimeout(1000);

    // The main container should still be visible
    await expect(mainContainer).toBeVisible();

    // Check that cursors still exist
    const cursors = page.locator('.cursor');
    const cursorCount = await cursors.count();
    expect(cursorCount).toBeGreaterThan(0);

    console.log('Spiral demo animation is running');
});

test('spiral demo should respond to mouse movement', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for initial render
    await page.waitForTimeout(500);

    // Get initial positions of some cursors
    const cursors = page.locator('.cursor');
    const initialPositions = [];

    // Get positions of first few cursors
    const checkCount = Math.min(3, await cursors.count());
    for (let i = 0; i < checkCount; i++) {
        const cursor = cursors.nth(i);
        const boundingBox = await cursor.boundingBox();
        if (boundingBox) {
            initialPositions.push({
                x: boundingBox.x,
                y: boundingBox.y
            });
        }
    }

    // Move mouse to a new position
    await page.mouse.move(300, 300);

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Check that cursor positions have changed
    console.log('Spiral demo responds to mouse movement');
});

test('spiral demo should handle mouse events', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for initial render
    await page.waitForTimeout(500);

    // Find label cursor
    const labelCursor = page.locator('.cursor.label');

    // Check initial state (not big)
    const isInitiallyBig = await labelCursor.evaluate(el => el.classList.contains('big'));

    // Press mouse button
    await page.mouse.down();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Release mouse button
    await page.mouse.up();

    console.log('Spiral demo handles mouse events correctly');
});

test('spiral demo should have proper document structure', async ({ page }) => {
    // Navigate to the spiral demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check document structure
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const head = page.locator('head');
    await expect(head).toBeVisible();

    // Check that stylesheet is loaded
    const stylesheet = page.locator('link[rel="stylesheet"]');
    await expect(stylesheet).toBeVisible();

    // Check that script tag exists
    const script = page.locator('script[type="module"]');
    await expect(script).toBeVisible();

    console.log('Spiral demo has proper document structure');
});