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

// Augment window type for test observables
declare global {
    interface Window {
    }
}

test('Context - Components component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, createContext, useContext } = woby

        // Implement component logic based on TestContextComponents.tsx
        const Context = createContext('')
        
        const element = h(TestContextComponents, null)

        function TestContextComponents() {
            return [
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
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraphs = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const count = await paragraphs.count()
    await expect(count).toBe(3)
    
    const firstText = await paragraphs.nth(0).evaluate(el => el.textContent)
    const secondText = await paragraphs.nth(1).evaluate(el => el.textContent)
    const thirdText = await paragraphs.nth(2).evaluate(el => el.textContent)
    
    // Add proper expectations based on TestContextComponents.tsx
    await expect(firstText).toBe('outer')
    await expect(secondText).toBe('inner')
    await expect(thirdText).toBe('outer')
})

