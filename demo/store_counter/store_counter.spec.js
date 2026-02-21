import { test, expect } from '@playwright/test';

test('store counter demo should load successfully', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('Store Counter');

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible();

    console.log('Store counter demo loaded successfully');
});

test('store counter demo should display counter', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that heading exists
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Store Counter');

    // Check that paragraph with value exists
    const valueParagraph = page.locator('p');
    await expect(valueParagraph).toBeVisible();

    // Check that value is a number
    const valueText = await valueParagraph.textContent();
    const value = parseInt(valueText);
    expect(!isNaN(value)).toBe(true);

    console.log(`Store counter demo displays counter with value: ${value}`);
});

test('store counter demo should have buttons', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that increment button exists
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    await expect(incrementButton).toBeVisible();

    // Check that decrement button exists
    const decrementButton = page.locator('button').filter({ hasText: '-' });
    await expect(decrementButton).toBeVisible();

    // Check button count
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBe(2);

    console.log('Store counter demo has increment and decrement buttons');
});

test('store counter demo buttons should be clickable', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find buttons
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    const decrementButton = page.locator('button').filter({ hasText: '-' });

    // Click increment button
    await incrementButton.click();

    // Click decrement button
    await decrementButton.click();

    console.log('Store counter demo buttons are clickable');
});

test('store counter demo should update counter value', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find value paragraph
    const valueParagraph = page.locator('p');

    // Find buttons
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    const decrementButton = page.locator('button').filter({ hasText: '-' });

    // Get initial value
    const initialText = await valueParagraph.textContent();
    const initialValue = parseInt(initialText);

    // Click increment button
    await incrementButton.click();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Get updated value
    const incrementedText = await valueParagraph.textContent();
    const incrementedValue = parseInt(incrementedText);

    // Click decrement button
    await decrementButton.click();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Get final value
    const decrementedText = await valueParagraph.textContent();
    const decrementedValue = parseInt(decrementedText);

    // Verify values changed correctly
    expect(incrementedValue).toBe(initialValue + 1);
    expect(decrementedValue).toBe(initialValue);

    console.log(`Store counter updated from ${initialValue} to ${incrementedValue} to ${decrementedValue}`);
});

test('store counter demo should use store functionality', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find value paragraph
    const valueParagraph = page.locator('p');

    // Get initial value
    const initialText = await valueParagraph.textContent();
    const initialValue = parseInt(initialText);

    // Click increment button
    const incrementButton = page.locator('button').filter({ hasText: '+' });
    await incrementButton.click();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Get updated value
    const incrementedText = await valueParagraph.textContent();
    const incrementedValue = parseInt(incrementedText);

    // Verify the store is working (value should increment by 1)
    expect(incrementedValue).toBe(initialValue + 1);

    console.log('Store counter demo uses store functionality correctly');
});

test('store counter demo should have proper document structure', async ({ page }) => {
    // Navigate to the store counter demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check document structure
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const head = page.locator('head');
    await expect(head).toBeVisible();

    // Check that script tag exists
    const script = page.locator('script[type="module"]');
    await expect(script).toBeVisible();

    console.log('Store counter demo has proper document structure');
});