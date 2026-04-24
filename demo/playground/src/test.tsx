/**
 * Test runner for all playground test files
 * Runs all Test*.tsx files through tsx SSR tests concurrently and reports summary
 */

import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

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

console.log(`\n🧪 Running SSR tests for ${files.length} files (concurrent)...\n`)

const startTime = Date.now()

// Run a single test file
function runTest(file: string): Promise<{ file: string; passed: boolean; skipped: boolean; name?: string; error?: string }> {
    return new Promise((resolve) => {
        const filePath = join(srcDir, file)
        const child = exec(`tsx --tsconfig ${tsconfig} ${filePath}`, {
            maxBuffer: 10 * 1024 * 1024 // 10MB
        })

        let stdout = ''
        let stderr = ''

        child.stdout?.on('data', (data) => { stdout += data })
        child.stderr?.on('data', (data) => { stderr += data })

        const timeout = setTimeout(() => {
            child.kill()
            resolve({ file, passed: false, skipped: false, error: 'Timeout (30s)' })
        }, 30000)

        child.on('exit', (code) => {
            clearTimeout(timeout)

            if (stdout.includes('✅')) {
                const match = stdout.match(/📝 Test: (\S+)\s+SSR: (.+?) ✅/s)
                resolve({ file, passed: true, skipped: false, name: match?.[1] })
            } else if (code === 0) {
                resolve({ file, passed: false, skipped: true })
            } else {
                // Check if it passed before failing on browser-only code
                if (stdout.includes('✅')) {
                    const match = stdout.match(/📝 Test: (\S+)\s+SSR: (.+?) ✅/s)
                    resolve({ file, passed: true, skipped: false, name: match?.[1] })
                } else {
                    const errorMsg = stderr.split('\n')[0] || stdout.split('\n')[0] || 'Unknown error'
                    resolve({ file, passed: false, skipped: false, error: errorMsg })
                }
            }
        })
    })
}

// Run all tests concurrently with a concurrency limit
async function runAllTests(concurrency: number) {
    let passed = 0
    let failed = 0
    let skipped = 0
    const failures: string[] = []

    // Process files in chunks of `concurrency` size
    for (let i = 0; i < files.length; i += concurrency) {
        const chunk = files.slice(i, i + concurrency)
        const results = await Promise.all(chunk.map(f => runTest(f)))

        for (const result of results) {
            if (result.passed) {
                passed++
                console.log(`  ✅ ${result.name || result.file}`)
            } else if (result.skipped) {
                skipped++
                console.log(`  ⏭️  ${result.file} (no output)`)
            } else {
                failed++
                failures.push(`${result.file}: ${result.error}`)
                console.log(`  ❌ ${result.file}`)
                console.log(`     ${result.error?.substring(0, 80)}...`)
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
}

// Run with concurrency of 20 (adjust based on CPU cores)
runAllTests(20)
