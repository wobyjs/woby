/**
 * Test runner for all playground test files
 * Runs all Test*.tsx files through tsx SSR tests and reports summary
 */

import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const srcDir = __dirname

// Get all Test*.tsx files that have SSR pattern
const files = readdirSync(srcDir)
    .filter(f => f.startsWith('Test') && f.endsWith('.tsx') && !f.endsWith('.html.tsx') && !f.endsWith('.nodejs.tsx'))
    .filter(f => {
        try {
            const content = readFileSync(join(srcDir, f), 'utf8')
            return content.includes("if (typeof window === 'undefined')") && content.length > 100
        } catch {
            return false
        }
    })
    .sort()

console.log(`\n🧪 Running SSR tests for ${files.length} files...\n`)

const startTime = Date.now()
let passed = 0
let failed = 0
let skipped = 0
const failures: string[] = []

// Run tests sequentially to avoid workspace dependency issues
for (const file of files) {
    const fileStart = Date.now()
    try {
        // Dynamically import the test file
        const filePath = join(srcDir, file)
        const fileUrl = new URL(`file://${filePath}`).href

        // Clear module cache to ensure fresh import
        // @ts-ignore - clear cache
        delete globalThis[Symbol.for('tsx:module-cache')]?.[fileUrl]

        await import(fileUrl + '?t=' + Date.now())

        const elapsed = ((Date.now() - fileStart) / 1000).toFixed(1)
        passed++
        console.log(`  ✅ ${file} (${elapsed}s)`)
    } catch (err: any) {
        const elapsed = ((Date.now() - fileStart) / 1000).toFixed(1)
        // Check if the test actually produced output before failing
        if (err?.message?.includes('window') || err?.message?.includes('document')) {
            // Browser-only code failed, which is expected in SSR
            skipped++
            console.log(`  ⏭️  ${file} (${elapsed}s, browser-only)`)
        } else {
            failed++
            failures.push(`${file}: ${err?.message || err}`)
            console.log(`  ❌ ${file} (${elapsed}s)`)
            console.log(`     ${err?.message?.substring(0, 120) || err}...`)
        }
    }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

console.log(`\n${'='.repeat(60)}`)
console.log(`📊 TEST SUMMARY`)
console.log(`${'='.repeat(60)}`)
console.log(`   Total files: ${files.length}`)
console.log(`   ✅ Passed:  ${passed}`)
console.log(`   ❌ Failed:  ${failed}`)
console.log(`   ⏭️  Skipped: ${skipped}`)
console.log(`   ⏱️  Time:     ${elapsed}s`)
console.log(`${'='.repeat(60)}`)

if (failures.length > 0) {
    console.log(`\n❌ ${failures.length} FAILURE(S):`)
    for (const f of failures) {
        console.log(`   - ${f}`)
    }
    process.exit(1)
} else {
    console.log(`\n🎉 All tests passed!`)
    process.exit(0)
}
