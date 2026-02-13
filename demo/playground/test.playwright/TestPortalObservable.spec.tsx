/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestPortalObservable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const component = $("a")
        const component = $("c")
        const component = $("ab")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Portal - Observable'),            h('p', null, "<Portal mount={document.body}>
                {component}
            </Portal>")
        )
        
        // Render to body
        render(element, document.body)
        
        // Define toggle function
        const toggle = () => component(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        
        // Define toggle function
        const toggle = () => component(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        
        // Define toggle function
        const toggle = () => component(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        ;(document.body as any)['toggleTestPortalObservable'] = toggle
        ;(document.body as any)['toggleTestPortalObservable'] = toggle
        ;(document.body as any)['toggleTestPortalObservable'] = toggle
    })

    // For static test, verify initial state
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('<!---->')
})