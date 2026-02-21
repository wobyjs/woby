/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestAttributeObservableBoolean component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $(false)
        const value = $(false)
        
        // Store observable globally for testing
        (window as any).testObservables = (window as any).testObservables || {}
        ;(window as any).testObservables['TestAttributeObservableBoolean'] = o

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Attribute - Observable Boolean'),
            h('p', { 'data-red': o }, "content")
        )
        
        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Attribute - Observable Boolean")')
    const isVisible = await element.isVisible()
    if (isVisible) {
        console.log('✅ TestAttributeObservableBoolean component rendered successfully')
    } else {
        console.log('⚠️ TestAttributeObservableBoolean component may not be visible')
    }
    
    // Verify the attribute value
    const pElement = page.locator('p:has-text("content")')
    const dataRed = await pElement.getAttribute('data-red')
    expect(dataRed).toBe('false')
})