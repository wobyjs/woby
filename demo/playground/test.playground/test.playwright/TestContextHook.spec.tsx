/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Augment window type for test observables
declare global {
    interface Window {
    }
}

test('Context - Hook component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        const { createContext, useContext } = woby
        
        const Context = createContext('')
        
        const element = h(TestContextHook, null)

        function TestContextHook() {
            const Reader = () => {
                const value = useContext(Context)
                return h('p', null, value)
            }
            return [
                h('h3', null, 'Context - Hook'),
                h(Context.Provider, { value: 'outer' },
                    h(Reader, null),
                    h(Context.Provider, { value: 'inner' },
                        h(Reader, null)
                    ),
                    h(Reader, null)
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Wait for rendering
    await page.waitForTimeout(50)
    
    // Get all p elements
    const paragraphs = await page.locator('p').all()
    
    // Verify each paragraph's content
    expect(paragraphs.length).toBe(3)
    
    const firstParaText = await paragraphs[0].textContent()
    const secondParaText = await paragraphs[1].textContent()
    const thirdParaText = await paragraphs[2].textContent()
    
    expect(firstParaText?.trim()).toBe('outer')
    expect(secondParaText?.trim()).toBe('inner')
    expect(thirdParaText?.trim()).toBe('outer')
})

