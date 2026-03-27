import { test, expect } from '@playwright/test'

test('simple test', async ({ page }) => {
    await page.setContent('<div>Hello World</div>')
    const element = await page.locator('div')
    await expect(element).toBeVisible()
    await expect(element).toContainText('Hello World')
    console.log('✅ Simple test passed')
})