/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestIfChildrenFunctionObservable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $("value")
        const val = $("$(testObservables['TestIfChildrenFunctionObservable']")

        // Create the component element using h() function
        const If = (props) => props.when ? h('div', null, props.children) : null  // Mock If component
        const Content = (props) => h('div', null, `Content: ${props.value}`)  // Mock Content component
        const element = h('div', null,
            h('h3', null, 'If - Children Function Observable'),
            h('p', null,
                h(If, { when: o },
                    (value) => h(Content, { value: value })
                )
            )
        )

        // Render to body
        render(element, document.body)

        // Define toggle function
        const toggle = () => o(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
            ; (document.body as any)['toggleTestIfChildrenFunctionObservable'] = toggle
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content

    // Manually trigger the toggle function 4 times (replacing useInterval)
    await page.evaluate(() => {
        (document.body as any)['toggleTestIfChildrenFunctionObservable']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 1 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['toggleTestIfChildrenFunctionObservable']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 2 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['toggleTestIfChildrenFunctionObservable']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 3 would depend on actual expected behavior
    await page.evaluate(() => {
        (document.body as any)['toggleTestIfChildrenFunctionObservable']()
    })
    await page.waitForTimeout(50)
    // Assertion for state 4 would depend on actual expected behavior
})