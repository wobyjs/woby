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

test('Context Dynamic Context component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render, createContext, useContext, Dynamic } = woby

        // Create context
        const Context = createContext('default')

        // DynamicFragment component
        const DynamicFragment = (props: any) => {
            const ctx = useContext(Context)
            return [
                h('p', null, ctx),
                h('p', null, props.children),
                h(Dynamic, { component: 'p' }, props.children),
                h(Dynamic, { component: 'p', children: props.children })
            ]
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Dynamic - Context'),
            h(Context.Provider, { value: 'context' },
                h(DynamicFragment, null,
                    h(DynamicFragment, null)
                )
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
    await expect(innerHTML).toBe('<h3>Dynamic - Context</h3><context-provider value="context"><p>context</p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p></context-provider>')
})
