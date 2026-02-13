/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSwitchDefaultFunction component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $("value")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Switch - Default Function'),<Switch when={-1}>
                <Switch.Case when={0}>
                                h('p', {}, "case")
                </Switch.Case>
                <Switch.Default>
                    {Default}
                </Switch.Default>
            </Switch>
        )
        
        // Render to body
        render(element, document.body)
        
        // Define randomize function
        const randomize = () => o(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        ;(document.body as any)['randomizeTestSwitchDefaultFunction'] = randomize
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Switch - Default Function")')
    await expect(element).toBeVisible()
})