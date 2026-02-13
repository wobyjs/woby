/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestCleanupInner component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const page = $("true")
        const bool = $("true")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Cleanup - Inner'),            h('p', null, "<Page />")
        )
        
        // Render to body
        render(element, document.body)
        
        // Define togglePage function
        const togglePage = () => page(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        
        // Define toggle function
        const toggle = () => bool(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        ;(document.body as any)['togglePageTestCleanupInner'] = togglePage
        ;(document.body as any)['toggleTestCleanupInner'] = toggle
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content

    // Manually trigger the togglePage function 4 times (replacing useInterval)
    await page.evaluate(() => {
        (document.body as any)['togglePageTestCleanupInner']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 1 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['togglePageTestCleanupInner']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 2 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['togglePageTestCleanupInner']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 3 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['togglePageTestCleanupInner']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 4 would depend on actual expected behavior
})