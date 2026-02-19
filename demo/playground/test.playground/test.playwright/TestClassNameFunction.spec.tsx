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
        testObservableClassNameFunction: import('woby').Observable<any>
    }
}

test('Class Name Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Observable for class
        const o = $('red')

        // Create the component element using h() function with function class
        const element = h('div', null,
            h('h3', null, 'ClassName - Function'),
            h('p', { 'class': () => o() } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification - initial state with 'red'
    const container = page.locator('div').first()

    // Verify the complete element structure
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>ClassName - Function</h3><p class="red">content</p>')
})
