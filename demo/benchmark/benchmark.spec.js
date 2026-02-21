import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
});

test.beforeAll(async () => {
    // Start the benchmark demo server
    // This would typically be handled by Playwright's webServer config
    // but we're showing the concept here
});

test('benchmark demo should load successfully', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle('Benchmark');

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible();

    console.log('Benchmark demo loaded successfully');
});

test('benchmark demo should display main container', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that container exists
    const container = page.locator('.container');
    await expect(container).toBeVisible();

    // Check that jumbotron exists
    const jumbotron = page.locator('.jumbotron');
    await expect(jumbotron).toBeVisible();

    console.log('Benchmark demo has visible container and jumbotron');
});

test('benchmark demo should have buttons', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that all benchmark buttons exist
    const runButton = page.locator('button#run');
    await expect(runButton).toBeVisible();
    await expect(runButton).toHaveText('Create 1,000 rows');

    const runLotsButton = page.locator('button#runlots');
    await expect(runLotsButton).toBeVisible();
    await expect(runLotsButton).toHaveText('Create 10,000 rows');

    const addButton = page.locator('button#add');
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText('Append 1,000 rows');

    const updateButton = page.locator('button#update');
    await expect(updateButton).toBeVisible();
    await expect(updateButton).toHaveText('Update every 10th row');

    const clearButton = page.locator('button#clear');
    await expect(clearButton).toBeVisible();
    await expect(clearButton).toHaveText('Clear');

    const swapRowsButton = page.locator('button#swaprows');
    await expect(swapRowsButton).toBeVisible();
    await expect(swapRowsButton).toHaveText('Swap Rows');

    // Check button count
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(6);

    console.log('Benchmark demo has all required buttons');
});

test('benchmark demo buttons should be clickable', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find buttons
    const runButton = page.locator('button#run');
    const clearButton = page.locator('button#clear');

    // Click run button
    await runButton.click();

    // Wait a bit for update
    await page.waitForTimeout(100);

    // Click clear button
    await clearButton.click();

    console.log('Benchmark demo buttons are clickable');
});

test('benchmark demo should display table', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that table exists
    const table = page.locator('table.table');
    await expect(table).toBeVisible();

    // Check that table has proper classes
    const tableClasses = await table.getAttribute('class');
    expect(tableClasses).toContain('table-hover');
    expect(tableClasses).toContain('table-striped');

    // Check that table body exists
    const tbody = table.locator('tbody');
    await expect(tbody).toBeVisible();

    console.log('Benchmark demo displays table with proper styling');
});

test('benchmark demo should create rows when run button is clicked', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find run button
    const runButton = page.locator('button#run');

    // Click run button to create 1,000 rows
    await runButton.click();

    // Wait for rows to be created
    await page.waitForTimeout(500);

    // Check that rows exist in table
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    // Should have 1,000 rows
    expect(rowCount).toBe(1000);

    console.log(`Benchmark demo created ${rowCount} rows`);
});

test('benchmark demo should clear rows when clear button is clicked', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Find buttons
    const runButton = page.locator('button#run');
    const clearButton = page.locator('button#clear');

    // Click run button to create rows
    await runButton.click();

    // Wait for rows to be created
    await page.waitForTimeout(500);

    // Check that rows exist
    const initialRows = page.locator('tbody tr');
    const initialRowCount = await initialRows.count();
    expect(initialRowCount).toBe(1000);

    // Click clear button
    await clearButton.click();

    // Wait for rows to be cleared
    await page.waitForTimeout(100);

    // Check that rows are cleared
    const finalRows = page.locator('tbody tr');
    const finalRowCount = await finalRows.count();
    expect(finalRowCount).toBe(0);

    console.log(`Benchmark demo cleared rows from ${initialRowCount} to ${finalRowCount}`);
});

test('benchmark demo should have proper document structure', async ({ page }) => {
    // Navigate to the benchmark demo via HTTP server
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check document structure
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const head = page.locator('head');
    await expect(head).toBeVisible();

    // Check that stylesheets are loaded
    const stylesheets = page.locator('link[rel="stylesheet"]');
    const stylesheetCount = await stylesheets.count();
    expect(stylesheetCount).toBeGreaterThanOrEqual(2);

    // Check that script tag exists
    const script = page.locator('script[type="module"]');
    await expect(script).toBeVisible();

    console.log('Benchmark demo has proper document structure with stylesheets');
});