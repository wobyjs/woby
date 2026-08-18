/**
 * Test runner for all playground test files
 * Runs all Test*.tsx files through tsx SSR tests concurrently and reports summary
 */

import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { aspectReport } from './aspects'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const srcDir = __dirname
const testDir = dirname(__dirname)
const tsconfig = join(testDir, 'tsconfig.json')

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

type Tally = { instances: number; ticks: number; ssr: number; dom: number; fail: number }
type Result = { file: string; passed: boolean; skipped: boolean; name?: string; error?: string; time: number; assertPass: number; assertFail: number; ticks: number; tests?: Record<string, Tally> }

// Each file's runSSRTest() emits one `📊 SSR RESULT {...}` line with its per-assertion tally,
// including a `tests` map keyed by test name — a file may declare several (TestCustomElementBasic
// has four), and it is that per-test breakdown that lines up with the browser's
// globalThis.__testResults. Files that predate the harness (multi-guard / non-TestSnapshots ones)
// emit none; they still count at file level, just without assertion detail.
function parseResult(stdout: string): { name?: string; pass: number; fail: number; ticks: number; tests?: Record<string, Tally> } | null {
    const m = stdout.match(/📊 SSR RESULT (\{.*\})/)
    if (!m) return null
    try {
        const r = JSON.parse(m[1])
        return { name: r.name, pass: r.pass || 0, fail: r.fail || 0, ticks: r.ticks || 0, tests: r.tests }
    } catch {
        return null
    }
}

// Run a single test file
function runTest(file: string): Promise<Result> {
    return new Promise((resolve) => {
        const filePath = join(srcDir, file)
        const childStart = Date.now()

        // Use pnpm exec to ensure workspace dependencies are available
        const cmd = `pnpm exec tsx --tsconfig "${tsconfig}" "${filePath}"`
        const child = exec(cmd, {
            cwd: testDir,
            shell: true,
            maxBuffer: 20 * 1024 * 1024
        })

        let stdout = ''
        let stderr = ''

        child.stdout?.on('data', (data) => { stdout += data })
        child.stderr?.on('data', (data) => { stderr += data })

        const timeout = setTimeout(() => {
            child.kill()
            resolve({ file, passed: false, skipped: false, error: 'Timeout (60s)', time: Date.now() - childStart, assertPass: 0, assertFail: 0, ticks: 0 })
        }, 60000)

        child.on('exit', (code, signal) => {
            clearTimeout(timeout)
            const elapsed = Date.now() - childStart
            const r = parseResult(stdout)
            const counts = { assertPass: r?.pass ?? 0, assertFail: r?.fail ?? 0, ticks: r?.ticks ?? 0, tests: r?.tests }

            // The exit code is authoritative: runSSRTest sets it from the assertion failures it
            // collected. Scanning stdout for a ✅ used to pass files that crashed after printing one.
            if (code === 0 && !counts.assertFail) {
                if (!r && !stdout.includes('✅')) {
                    resolve({ file, passed: false, skipped: true, time: elapsed, ...counts })
                } else {
                    resolve({ file, passed: true, skipped: false, name: r?.name, time: elapsed, ...counts })
                }
            } else {
                // Show full error context for debugging
                const errorMsg = stderr.trim() || stdout.trim() || `Exit code ${code}, signal: ${signal}`
                resolve({ file, passed: false, skipped: false, error: errorMsg, time: elapsed, ...counts })
            }
        })
    })
}

// Run all tests concurrently with a concurrency limit
async function runAllTests(concurrency: number) {
    let passed = 0
    let failed = 0
    let skipped = 0
    let assertPass = 0
    let assertFail = 0
    let ticks = 0
    let noHarness = 0
    const failures: string[] = []
    // Per-test tally, same shape and same keys as the browser's globalThis.__testResults, so the
    // two suites can be diffed test by test instead of comparing two grand totals.
    const perTest: Record<string, Tally> = {}
    const collisions = new Set<string>()

    // Process files in chunks of `concurrency` size
    for (let i = 0; i < files.length; i += concurrency) {
        const chunk = files.slice(i, i + concurrency)
        const results = await Promise.all(chunk.map(f => runTest(f)))

        for (const result of results) {
            assertPass += result.assertPass
            assertFail += result.assertFail
            ticks += result.ticks
            if (!result.ticks && !result.skipped) noHarness++
            // Merge, don't overwrite: two files can declare a component of the same name, and
            // assigning would silently drop one of them from the totals.
            for (const [k, v] of Object.entries(result.tests ?? {})) {
                const prev = perTest[k]
                if (!prev) { perTest[k] = { ...v }; continue }
                collisions.add(k)
                prev.instances += v.instances; prev.ticks += v.ticks
                prev.ssr += v.ssr; prev.dom += v.dom; prev.fail += v.fail
            }

            if (result.passed) {
                passed++
                const detail = Object.entries(result.tests ?? {})
                    .map(([k, v]) => `${k}: ${v.ticks} tick${v.ticks === 1 ? '' : 's'}/${v.ssr} assertion${v.ssr === 1 ? '' : 's'}`)
                    .join(', ') || `${result.assertPass} assertions`
                console.log(`  ✅ ${result.file.replace(/\.tsx$/, '')} — ${detail} (${(result.time / 1000).toFixed(1)}s)`)
            } else if (result.skipped) {
                skipped++
                console.log(`  ⏭️  ${result.file} (${(result.time / 1000).toFixed(1)}s, no output)`)
            } else {
                failed++
                failures.push(`${result.file}: ${result.error}`)
                console.log(`  ❌ ${result.file} (${(result.time / 1000).toFixed(1)}s)`)
                console.log(`     ${result.error?.substring(0, 120)}...`)
            }
        }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

    console.log(`\n${'='.repeat(60)}`)
    console.log(`📊 SSR TEST SUMMARY`)
    console.log(`${'='.repeat(60)}`)
    console.log(`   Total files: ${files.length}`)
    console.log(`   ✅ Passed:  ${passed}`)
    console.log(`   ❌ Failed:  ${failed}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ⏱️  Time:     ${elapsed}s`)
    console.log(`${'-'.repeat(60)}`)
    console.log(`   Test components: ${Object.keys(perTest).length}`)
    console.log(`   Ticks:      ${ticks}`)
    console.log(`   Assertions: ${assertPass + assertFail}`)
    console.log(`   ├ SSR (renderToString — the number the browser must match): ${assertPass}`)
    console.log(`   └ DOM (innerHTML — browser only, never runs here):          0`)
    console.log(`   ❌ Failed:  ${assertFail}`)
    if (noHarness) console.log(`   ⚠️  ${noHarness} file(s) ran without the per-assertion harness (file-level only)`)
    console.log(`${'='.repeat(60)}`)
    // Which part of the framework the run actually covered. The raw per-test map is what the
    // browser's globalThis.__testResults diffs against, but it is unreadable in a log tail — so
    // it is grouped by aspect here and only dumped as JSON when TEST_JSON=1 asks for it.
    console.log(`\n📋 COVERAGE BY ASPECT`)
    for (const line of aspectReport(perTest)) console.log(`   ${line}`)
    if (collisions.size) console.log(`   ⚠️  name declared by more than one file: ${[...collisions].join(', ')}`)
    console.log(`${'='.repeat(60)}`)
    if (process.env.TEST_JSON) console.log(`📊 SSR RESULTS ${JSON.stringify(perTest)}`)

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
