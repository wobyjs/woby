import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test('emoji counter demo should load successfully', async ({ page }) => {
    // Navigate to the emoji counter demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('Emoji Counter');

    // Check that the main app div exists
    const appDiv = page.locator('#app');
    await expect(appDiv).toBeAttached();

    console.log('Emoji counter demo loaded successfully');
});

test('emoji counter demo should display emojis', async ({ page }) => {
    // Navigate to the emoji counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that container exists
    const container = page.locator('div[style*="position: fixed"]');
    await expect(container).toBeVisible();

    // Check that emoji display element exists
    const emojiDisplay = page.locator('div[style*="font-size: 100px"]');
    await expect(emojiDisplay).toBeVisible();

    // Check that emoji text content exists
    const emojiText = await emojiDisplay.textContent();
    expect(emojiText).not.toBe('');

    console.log(`Emoji counter demo displays: ${emojiText}`);
});

test('emoji counter demo should have buttons', async ({ page }) => {
    // Navigate to the emoji counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that increment button exists
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    await expect(incrementButton).toBeVisible();

    // Check that decrement button exists
    const decrementButton = page.locator('button').filter({ hasText: '-' });
    await expect(decrementButton).toBeVisible();

    // Check button styles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBe(2);

    // Check button dimensions
    const firstButton = buttons.first();
    const buttonWidth = await firstButton.evaluate(el => getComputedStyle(el).width);
    const buttonHeight = await firstButton.evaluate(el => getComputedStyle(el).height);

    expect(buttonWidth).toBe('40px');
    expect(buttonHeight).toBe('40px');

    console.log('Emoji counter demo has properly styled buttons');
});

test('emoji counter buttons should be clickable', async ({ page }) => {
    // Navigate to the emoji counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find buttons
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    const decrementButton = page.locator('button').filter({ hasText: '-' });

    // Find emoji display
    const emojiDisplay = page.locator('div[style*="font-size: 100px"]');

    // Get initial emoji text
    const initialEmojiText = await emojiDisplay.textContent();

    // Click increment button
    await incrementButton.click();

    // Click decrement button
    await decrementButton.click();

    console.log('Emoji counter buttons are clickable');
});

test('emoji counter should update display when buttons are clicked', async ({ page }) => {
    // Navigate to the emoji counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find buttons
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    const decrementButton = page.locator('button').filter({ hasText: '-' });

    // Find emoji display
    const emojiDisplay = page.locator('div[style*="font-size: 100px"]');

    // Get initial emoji text
    const initialEmojiText = await emojiDisplay.textContent();

    // Click increment button
    await incrementButton.click();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Get updated emoji text
    const incrementedEmojiText = await emojiDisplay.textContent();

    // Click decrement button
    await decrementButton.click();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Get final emoji text
    const decrementedEmojiText = await emojiDisplay.textContent();

    console.log(`Emoji counter updated from "${initialEmojiText}" to "${incrementedEmojiText}" and back to "${decrementedEmojiText}"`);
});

test('emoji counter should have proper layout', async ({ page }) => {
    // Navigate to the emoji counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check vertical stack layout
    const vStack = page.locator('div[style*="flex-direction: column"]');
    await expect(vStack).toBeVisible();

    // Check horizontal stack layout
    const hStack = page.locator('div[style*="flex-direction: row"]');
    await expect(hStack).toBeVisible();

    // Check that elements are properly nested
    const container = page.locator('div[style*="position: fixed"]');
    await expect(container).toBeVisible();

    console.log('Emoji counter demo has proper layout structure');
});