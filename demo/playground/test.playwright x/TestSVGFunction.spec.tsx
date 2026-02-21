/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSVGFunction component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const color = $("value")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'SVG - Function'),
            h('svg', { 'viewBox': '0 0 50 50', 'width': '50px', 'stroke': () => color(), 'stroke-width': '3', 'fill': 'white' },
                h('circle', { 'cx': '25', 'cy': '25', 'r': '20' })
            )
        )

        // Render to body
        render(element, document.body)

        // Define update function
        const update = () => color((prev: any) => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
            ; (document.body as any)['updateTestSVGFunction'] = update
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content

    // Manually trigger the update function 4 times (replacing useInterval)
    await page.evaluate(() => {
        (document.body as any)['updateTestSVGFunction']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 1 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['updateTestSVGFunction']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 2 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['updateTestSVGFunction']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 3 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['updateTestSVGFunction']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 4 would depend on actual expected behavior
})