/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Debug Woby UMD loading', async ({ page }) => {
    // Load Woby UMD build
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    // Debug what's available
    const result = await page.evaluate(() => {
        console.log('Window keys:', Object.keys(window).filter(k => k.includes('woby') || k === 'woby'))
        console.log('Woby object:', typeof (window as any).woby)
        if ((window as any).woby) {
            console.log('Woby keys:', Object.keys((window as any).woby))
            console.log('$ function:', typeof (window as any).woby.$)
            console.log('h function:', typeof (window as any).woby.h)
            console.log('render function:', typeof (window as any).woby.render)
        }
        return {
            hasWoby: !!(window as any).woby,
            hasDollar: !!(window as any).woby?.$,
            hasH: !!(window as any).woby?.h,
            hasRender: !!(window as any).woby?.render
        }
    })

    console.log('Debug result:', result)
    expect(result.hasWoby).toBe(true)
    expect(result.hasDollar).toBe(true)
    expect(result.hasH).toBe(true)
    expect(result.hasRender).toBe(true)
})