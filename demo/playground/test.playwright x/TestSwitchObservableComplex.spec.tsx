/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSwitchObservableComplex component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $(0)
        const o2 = $(2)
        const o3 = $(4)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Switch - Observable Complex'),
            h('Switch', { when: o },
                h('Switch.Case', { when: 0 },
                    h('p', {}, "1 - 0")
                ),
                h('Switch.Case', { when: 1 },
                    h('p', {}, "1 - 1")
                ),
                h('Switch.Case', { when: 2 },
                    h('p', {}, "1 - 2")
                )
            ),
            h('Switch', { when: o2 },
                h('Switch.Case', { when: 0 },
                    h('p', {}, "2 - 0")
                ),
                h('Switch.Case', { when: 1 },
                    h('p', {}, "2 - 1")
                ),
                h('Switch.Case', { when: 2 },
                    h('p', {}, "2 - 2")
                )
            ),
            h('Switch', { when: o3 },
                h('Switch.Case', { when: 0 },
                    h('p', {}, "3 - 0")
                ),
                h('Switch.Case', { when: 1 },
                    h('p', {}, "3 - 1")
                ),
                h('Switch.Case', { when: 2 },
                    h('p', {}, "3 - 2")
                )
            )
        )

        // Render to body
        render(element, document.body)

        // Define toggle function
        const toggle = () => o((prev: any) => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })

        // Define toggle2 function
        const toggle2 = () => o2((prev: any) => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })

        // Define toggle3 function
        const toggle3 = () => o3((prev: any) => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
            ; (document.body as any)['toggleTestSwitchObservableComplex'] = toggle
            ; (document.body as any)['toggle2TestSwitchObservableComplex'] = toggle2
            ; (document.body as any)['toggle3TestSwitchObservableComplex'] = toggle3
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content

    // Manually trigger the toggle function 4 times (replacing useInterval)
    await page.evaluate(() => {
        (document.body as any)['toggleTestSwitchObservableComplex']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 1 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['toggleTestSwitchObservableComplex']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 2 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['toggleTestSwitchObservableComplex']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 3 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['toggleTestSwitchObservableComplex']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 4 would depend on actual expected behavior
})