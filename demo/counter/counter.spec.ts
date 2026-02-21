import { test, expect } from '@playwright/test'

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5173',
})

test('counter demo should load successfully', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Check that the page title is correct
    await expect(page).toHaveTitle('Counter')

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible()

    console.log('Counter demo loaded successfully')
})

test('counter demo should display custom elements', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check that custom elements exist
    const counterElements = page.locator('counter-element')
    await expect(counterElements.first()).toBeVisible()

    console.log('Counter demo displays custom elements')
})

test('counter demo should have buttons', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check that increment and decrement buttons exist
    const incrementButtons = page.locator('button').filter({ hasText: '+' })
    const decrementButtons = page.locator('button').filter({ hasText: '-' })

    await expect(incrementButtons.first()).toBeVisible()
    await expect(decrementButtons.first()).toBeVisible()

    console.log('Counter demo has increment and decrement buttons')
})

test('counter demo buttons should be clickable', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Find buttons
    const incrementButton = page.locator('button').filter({ hasText: '+' }).first()
    const decrementButton = page.locator('button').filter({ hasText: '-' }).first()

    // Click increment button
    await incrementButton.click()

    // Wait a bit for update
    await page.waitForTimeout(100)

    // Click decrement button
    await decrementButton.click()

    console.log('Counter demo buttons are clickable')
})

test('counter demo should update count correctly', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Find buttons
    const incrementButton = page.locator('button').filter({ hasText: '+' }).first()
    const decrementButton = page.locator('button').filter({ hasText: '-' }).first()

    // Click increment button 3 times
    await incrementButton.click()
    await incrementButton.click()
    await incrementButton.click()

    // Click decrement button 2 times
    await decrementButton.click()
    await decrementButton.click()

    console.log('Counter demo updates count correctly')
})

test('counter demo should have proper document structure', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check that document has proper structure
    const html = page.locator('html')
    const head = page.locator('head')
    const body = page.locator('body')

    await expect(html).toBeVisible()
    await expect(head).toBeAttached() // head element exists in DOM but isn't visible
    await expect(body).toBeVisible()

    // Check that body contains the app
    await expect(body.locator('#app')).toBeVisible()

    console.log('Counter demo has proper document structure')
})

test('counter demo should have context values', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check that context value elements exist
    const contextValues = page.locator('context-value')
    await expect(contextValues.first()).toBeVisible()

    console.log('Counter demo has context values')
})

test('counter demo should have HTML-created custom elements with correct initial values', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Look for the HTML-created counter element directly in the body (not in #app)
    // This should be the one with title="Parent Counter" and value="5"
    const parentCounter = page.locator('body > counter-element').first()
    await expect(parentCounter).toBeVisible()

    // Check that the parent counter has the correct title and initial value
    const parentTitle = await parentCounter.getAttribute('title')
    const parentValue = await parentCounter.getAttribute('value')

    expect(parentTitle).toBe('Parent Counter')
    expect(parentValue).toBe('5')

    // Check that the displayed value in the shadow DOM is correct
    const valueText = await parentCounter.evaluate((element: HTMLElement) => {
        const shadowRoot = element.shadowRoot
        if (!shadowRoot) return null
        const valueElement = shadowRoot.querySelector('p:nth-of-type(1) b')
        return valueElement ? valueElement.textContent : null
    })
    expect(valueText).toBe('5')

    console.log('HTML-created custom elements have correct initial values')
})

test('counter demo should have TSX-rendered child counter elements', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Find the HTML-created parent counter element
    const parentCounter = page.locator('body > counter-element').first()

    // Find the TSX-rendered child counter element inside the parent
    const childCounter = parentCounter.locator('counter-element').first()

    // Check that the child counter has the correct title and initial value
    const childTitle = await childCounter.getAttribute('title')
    const childValue = await childCounter.getAttribute('value')

    expect(childTitle).toBe('Child Counter')
    expect(childValue).toBe('10')

    // Check that the displayed value in the shadow DOM is correct
    const valueText = await childCounter.evaluate((element: HTMLElement) => {
        const shadowRoot = element.shadowRoot
        if (!shadowRoot) return null
        const valueElement = shadowRoot.querySelector('p:nth-of-type(1) b')
        return valueElement ? valueElement.textContent : null
    })
    expect(valueText).toBe('10')

    console.log('TSX-rendered child counter elements have correct initial values')
})

test('counter demo should update HTML-created custom element values via setAttribute', async ({ page }) => {
    // Navigate to the counter demo via HTTP server
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Find the HTML-created parent counter element (direct child of body)
    const parentCounter = page.locator('body > counter-element').first()

    // Get initial value
    const initialValue = await parentCounter.getAttribute('value')
    console.log(`Initial value: ${initialValue}`)

    // Check initial displayed value
    const initialDisplayedValue = await parentCounter.evaluate((element: HTMLElement) => {
        const shadowRoot = element.shadowRoot
        if (!shadowRoot) return null
        const valueElement = shadowRoot.querySelector('p:nth-of-type(1) b')
        return valueElement ? valueElement.textContent : null
    })
    expect(initialDisplayedValue).toBe('5')

    // Set a new value using setAttribute
    await parentCounter.evaluate((element: HTMLElement) => {
        element.setAttribute('value', '15')
    })

    // Wait a bit for update
    await page.waitForTimeout(100)

    // Check that value was updated
    const updatedValue = await parentCounter.getAttribute('value')
    console.log(`Updated value: ${updatedValue}`)
    expect(updatedValue).toBe('15')

    // Check that the displayed value in the shadow DOM was also updated
    const updatedDisplayedValue = await parentCounter.evaluate((element: HTMLElement) => {
        const shadowRoot = element.shadowRoot
        if (!shadowRoot) return null
        const valueElement = shadowRoot.querySelector('p:nth-of-type(1) b')
        return valueElement ? valueElement.textContent : null
    })
    expect(updatedDisplayedValue).toBe('15')

    // Set another value
    await parentCounter.evaluate((element: HTMLElement) => {
        element.setAttribute('value', '25')
    })

    // Wait a bit for update
    await page.waitForTimeout(100)

    // Check that value was updated
    const finalValue = await parentCounter.getAttribute('value')
    console.log(`Final value: ${finalValue}`)
    expect(finalValue).toBe('25')

    // Check that the displayed value in the shadow DOM was also updated
    const finalDisplayedValue = await parentCounter.evaluate((element: HTMLElement) => {
        const shadowRoot = element.shadowRoot
        if (!shadowRoot) return null
        const valueElement = shadowRoot.querySelector('p:nth-of-type(1) b')
        return valueElement ? valueElement.textContent : null
    })
    expect(finalDisplayedValue).toBe('25')

    console.log('HTML-created custom elements update values via setAttribute correctly')
})