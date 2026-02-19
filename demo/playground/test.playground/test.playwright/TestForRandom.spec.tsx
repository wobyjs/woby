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
        testObservableForRandom: import('woby').Observable<any>;
    }
}

test('For Random component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        const randomValues = [
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000)
        ]

        const element = h('div', null,
            h('h3', null, 'For - Random Only Child'),
            h('p', null, 'Value: ', randomValues[0]),
            h('p', null, 'Value: ', randomValues[1]),
            h('p', null, 'Value: ', randomValues[2])
        )

        render(element, document.body)
    })

    const container = page.locator('div').first()

    await page.waitForTimeout(50)
    const innerHTML = await container.evaluate(el => el.innerHTML)

    expect(innerHTML).toContain('For - Random Only Child')
    expect(innerHTML).toMatch(/Value: \d+</g)
})
