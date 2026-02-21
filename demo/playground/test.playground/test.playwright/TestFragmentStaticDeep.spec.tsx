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
        testTestFragmentStaticDeep: import('woby').Observable<undefined>
    }
}

test('Fragment - Static Deep component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Fragment } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Fragment - Static Deep'),
            h(Fragment, {},
                h('p', null, 'first')
            ),
            h(Fragment, {},
                h('p', null, 'second')
            ),
            h(Fragment, {},
                h(Fragment, {},
                    h(Fragment, {},
                        h(Fragment, {},
                            h('p', null, 'deep')
                        )
                    )
                )
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that all paragraphs are rendered
    await page.waitForTimeout(50)
    const paragraphs = await page.$$('p')
    await expect(paragraphs.length).toBe(3)

    const firstText = await paragraphs[0].evaluate(el => el.textContent)
    const secondText = await paragraphs[1].evaluate(el => el.textContent)
    const thirdText = await paragraphs[2].evaluate(el => el.textContent)

    await expect(firstText).toBe('first')
    await expect(secondText).toBe('second')
    await expect(thirdText).toBe('deep')
})

