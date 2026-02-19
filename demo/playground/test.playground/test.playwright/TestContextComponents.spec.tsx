/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Context Components component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render, createContext, useContext } = woby

        // Create context
        const Context = createContext('')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Context - Components'),
            h(Context.Provider, { value: 'outer' },
                () => {
                    const value = useContext(Context)
                    return h('p', null, value)
                },
                h(Context.Provider, { value: 'inner' },
                    () => {
                        const value = useContext(Context)
                        return h('p', null, value)
                    }
                ),
                () => {
                    const value = useContext(Context)
                    return h('p', null, value)
                }
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div').first()

    // Verify the complete element structure
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>Context - Components</h3><context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider>')
})
