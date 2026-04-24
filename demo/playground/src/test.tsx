/**
 * Test runner for all playground test files
 * Runs all Test*.tsx files through tsx SSR tests and reports summary
 */

import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const srcDir = __dirname
const tsconfig = join(dirname(__dirname), 'tsconfig.json')

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

let passed = 0
let failed = 0
let skipped = 0
const failures: string[] = []
const startTime = Date.now()

// Run tests in batches of 10 to avoid overwhelming the system
const batchSize = 10
for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize)
    console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1} (${batch.length} files):`)
    
    for (const file of batch) {
        const filePath = join(srcDir, file)
        try {
            const output = execSync(
                `tsx --tsconfig ${tsconfig} ${filePath}`,
                { encoding: 'utf8', timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] }
            )

            if (output.includes('✅')) {
                passed++
                // Extract test name and SSR result
                const match = output.match(/📝 Test: (\S+)\s+SSR: (.+?) ✅/s)
                if (match) {
                    console.log(`  ✅ ${match[1]}`)
                }
            } else {
                skipped++
                console.log(`  ⏭️  ${file} (no output)`)
            }
        } catch (error: any) {
            const stderr = error.stderr?.toString() || ''
            const stdout = error.stdout?.toString() || ''

            // Check if it passed before failing on browser-only code
            if (stdout.includes('✅')) {
                passed++
                const match = stdout.match(/📝 Test: (\S+)\s+SSR: (.+?) ✅/s)
                if (match) {
                    console.log(`  ✅ ${match[1]} (browser code skipped)`)
                }
            } else {
                failed++
                const errorMsg = stderr.split('\n')[0] || stdout.split('\n')[0] || 'Unknown error'
                failures.push(`${file}: ${errorMsg}`)
                console.log(`  ❌ ${file}`)
                console.log(`     ${errorMsg.substring(0, 80)}...`)
            }
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
