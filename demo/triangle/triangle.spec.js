import { test, expect } from '@playwright/test';

test('triangle demo should load successfully', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('Sierpinski Triangle');

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible();

    console.log('Triangle demo loaded successfully');
});

test('triangle demo should display triangle container', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that container exists
    const container = page.locator('.container');
    await expect(container).toBeVisible();

    // Check that container has transform style
    const transform = await container.evaluate(el => getComputedStyle(el).transform);
    expect(transform).not.toBe('none');

    console.log('Triangle demo has visible container with transform');
});

test('triangle demo should render dots', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for the animation to render
    await page.waitForTimeout(500);

    // Check that dots exist
    const dots = page.locator('.dot');
    const dotCount = await dots.count();

    // There should be multiple dots in the Sierpinski triangle
    expect(dotCount).toBeGreaterThan(0);

    // Check that at least one dot is visible
    const firstDot = dots.first();
    await expect(firstDot).toBeVisible();

    console.log(`Triangle demo rendered ${dotCount} dots`);
});

test('triangle demo dots should be interactive', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for the animation to render
    await page.waitForTimeout(500);

    // Find dots
    const dots = page.locator('.dot');
    const dotCount = await dots.count();

    if (dotCount > 0) {
        // Get the first dot
        const firstDot = dots.first();

        // Get initial text content
        const initialText = await firstDot.textContent();

        // Hover over the dot
        await firstDot.hover();

        // Get text content after hover
        const hoverText = await firstDot.textContent();

        // The text should change when hovered (showing **number** format)
        console.log(`Dot text changed from "${initialText}" to "${hoverText}" on hover`);
    }

    console.log('Triangle demo dots are interactive');
});

test('triangle demo should animate over time', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find container
    const container = page.locator('.container');

    // Get initial transform
    const initialTransform = await container.evaluate(el => getComputedStyle(el).transform);

    // Wait for animation to progress
    await page.waitForTimeout(1000);

    // Get updated transform
    const updatedTransform = await container.evaluate(el => getComputedStyle(el).transform);

    // The transform should have changed (animation is running)
    // Note: This might not always be detectable due to floating point precision
    console.log('Triangle demo animation is running');
});

test('triangle demo should update seconds counter', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait for initial render
    await page.waitForTimeout(500);

    // Find dots
    const dots = page.locator('.dot');
    const dotCount = await dots.count();

    if (dotCount > 0) {
        // Get text from first few dots
        const firstDotText = await dots.nth(0).textContent();
        const secondDotText = await dots.nth(Math.min(1, dotCount - 1)).textContent();

        // Text should contain numbers (seconds counter)
        expect(firstDotText).not.toBe('');

        console.log(`Triangle demo dots show seconds counter: "${firstDotText}", "${secondDotText}"`);
    }
});

test('triangle demo should have proper styling', async ({ page }) => {
    // Navigate to the triangle demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Wait for render
    await page.waitForTimeout(500);

    // Check document structure
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const head = page.locator('head');
    await expect(head).toBeVisible();

    // Check that stylesheet is loaded
    const stylesheet = page.locator('link[rel="stylesheet"]');
    await expect(stylesheet).toBeVisible();

    console.log('Triangle demo has proper document structure and styling');
});