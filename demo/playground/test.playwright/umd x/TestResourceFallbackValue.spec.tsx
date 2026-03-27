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

test('Resource - Fallback Value component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, useResource, ErrorBoundary, If } = woby

        // Implement component logic based on TestResourceFallbackValue.tsx
        const element = h(TestResourceFallbackValue, null)

        function TestResourceFallbackValue() {
            const resource = useResource(() => { throw new Error('Some error') })
            return [
                h('h3', null, 'Resource - Fallback Value'),
                h(ErrorBoundary, { fallback: h('p', null, 'Error!') },
                    h(If, { when: () => resource().value, fallback: h('p', null, 'Loading!') },
                        h('p', null, 'Loaded!')
                    )
                ),
                h(ErrorBoundary, { fallback: h('p', null, 'Error!') },
                    h(If, { when: resource.value, fallback: h('p', null, 'Loading!') },
                        h('p', null, 'Loaded!')
                    )
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraphs = page.locator('p')

    // Wait for the resource to fail and show error messages
    await page.waitForTimeout(100)
    const count = await paragraphs.count()
    const firstError = await paragraphs.nth(0).textContent()
    const secondError = await paragraphs.nth(1).textContent()
    
    // Both ErrorBoundary components should show 'Error!' because the resource throws
    await expect(count).toBe(2)
    await expect(firstError).toBe('Error!')
    await expect(secondError).toBe('Error!')
})

