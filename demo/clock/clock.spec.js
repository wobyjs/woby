import { test, expect } from '@playwright/test';

test('clock demo should load successfully', async ({ page }) => {
    // Navigate to the clock demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('Clock');

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible();

    console.log('Clock demo loaded successfully');
});

test('clock demo should have SVG clock face', async ({ page }) => {
    // Navigate to the clock demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that clock element exists
    const clock = page.locator('.clock');
    await expect(clock).toBeVisible();

    // Check that SVG element exists
    const svg = page.locator('svg');
    await expect(svg).toBeVisible();

    // Check that SVG has proper viewBox
    const viewBox = await svg.getAttribute('viewBox');
    expect(viewBox).toBe('0 0 100 100');

    console.log('Clock demo has SVG clock face with proper viewBox');
});

test('clock demo should have clock elements', async ({ page }) => {
    // Navigate to the clock demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that clock face circle exists
    const clockFace = page.locator('circle.clock-face');
    await expect(clockFace).toBeVisible();

    // Check that minor lines exist (60 of them)
    const minorLines = page.locator('line.minor');
    const minorCount = await minorLines.count();
    expect(minorCount).toBe(60);

    // Check that major lines exist (12 of them)
    const majorLines = page.locator('line.major');
    const majorCount = await majorLines.count();
    expect(majorCount).toBe(12);

    // Check that clock hands exist
    const millisecondHand = page.locator('line.millisecond');
    await expect(millisecondHand).toBeVisible();

    const hourHand = page.locator('line.hour');
    await expect(hourHand).toBeVisible();

    const minuteHand = page.locator('line.minute');
    await expect(minuteHand).toBeVisible();

    const secondHand = page.locator('line.second');
    await expect(secondHand).toBeVisible();

    console.log(`Clock demo has ${minorCount} minor lines, ${majorCount} major lines, and all clock hands`);
});

test('clock demo hands should update position', async ({ page }) => {
    // Navigate to the clock demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Get initial transform values for second hand
    const secondHand = page.locator('line.second');
    const initialTransform = await secondHand.getAttribute('transform');

    // Wait for a short time to see if the transform updates
    await page.waitForTimeout(1000);

    // Get updated transform value
    const updatedTransform = await secondHand.getAttribute('transform');

    // The transform should have changed (clock is moving)
    expect(updatedTransform).not.toBe(initialTransform);

    console.log('Clock hands are updating position correctly');
});

test('clock demo should render continuously', async ({ page }) => {
    // Navigate to the clock demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that SVG element is not empty
    const svg = page.locator('svg');
    await expect(svg).not.toBeEmpty();

    // Check that the clock container has content
    const clock = page.locator('.clock');
    await expect(clock).not.toBeEmpty();

    console.log('Clock demo is rendering continuously');
});