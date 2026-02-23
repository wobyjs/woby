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

test('Dynamic - Context component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, createContext, useContext, Dynamic } = woby

        // Component logic extracted from source file
        // Dynamic context with nested components - uses createContext and useContext
        // [Implementation based on source file: TestContextDynamicContext.tsx]
        
        function TestContextDynamicContext() {
            const Context = createContext('default')
            
            const DynamicFragment = (props) => {
                const ctx = useContext(Context)
                const children = props?.children || []
                return [
                    h('p', null, ctx),
                    h('p', null, children),
                    h(Dynamic, { component: 'p' }, children),
                    h(Dynamic, { component: 'p', children: children })
                ]
            }
            
            return [
                h('h3', null, 'Dynamic - Context'),
                h(Context.Provider, { value: 'context' },
                    h(DynamicFragment, null,
                        h(DynamicFragment, null)
                    )
                )
            ]
        }

        // Render to body
        const element = h(TestContextDynamicContext)
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraphs = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Dynamic - Context')
    
    // Check expected HTML structure matches source exactly
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = '<h3>Dynamic - Context</h3><p>context</p><p><p>context</p><p><!----></p><p><!----></p><p><!----></p></p><p><p>context</p><p><!----></p><p><!----></p><p><!----></p></p><p><!----></p>'
    await expect(bodyHTML).toBe(expectedHTML)
})

