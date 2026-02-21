/** @jsxImportSource woby */

import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('woby umd build loading test', async ({ page }) => {
    // Create a basic HTML page
    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Woby UMD Test</title>
        </head>
        <body>
        </body>
        </html>
    `)

    // Load Woby UMD build from dist folder
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    console.log('Woby UMD script length:', wobyScript.length)
    await page.addScriptTag({ content: wobyScript })

    // Wait for woby to be available in the page (UMD builds typically expose to window)
    await page.waitForFunction(() => (window as any).woby !== undefined, { timeout: 10000 })

    // Verify basic woby functionality
    const hasWoby = await page.evaluate(() => {
        return typeof (window as any).woby !== 'undefined'
    })

    expect(hasWoby).toBe(true)

    // Test rendering with woby using h function (JSX compiles to this)
    await page.evaluate(() => {
        const woby = (window as any).woby
        const element = woby.h('div', null, 'Hello from Woby JSX render!')
        woby.render(element, document.body)
    })

    // Verify the content was rendered
    await expect(page.locator('div')).toHaveText('Hello from Woby JSX render!')

    console.log('Successfully loaded Woby UMD build and rendered content!')
})