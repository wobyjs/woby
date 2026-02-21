/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestForRandomOnlyChild component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const values1 = $("value")
        const values2 = $("$(testObservables['TestForRandomOnlyChild']")

        // Create the component element using h() function
        const For = (props) => {
            return props.values().map(props.children)
        } // Mock For component
        const element = h('div', null,
            h('h3', null, 'For - Random'),
            h(For, { values: values2 },
                (value) => h('p', {}, "[observable-content]")
            )
        )

        // Render to body
        render(element, document.body)

        // Define update function
        const update = () => values2(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
            ; (document.body as any)['updateTestForRandomOnlyChild'] = update
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content

    // Manually trigger the update function 4 times (replacing useInterval)
    await page.evaluate(() => {
        (document.body as any)['updateTestForRandomOnlyChild']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 1 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['updateTestForRandomOnlyChild']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 2 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['updateTestForRandomOnlyChild']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 3 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['updateTestForRandomOnlyChild']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 4 would depend on actual expected behavior
})