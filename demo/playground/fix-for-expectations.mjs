import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const specsDir = path.join(__dirname, 'test.playground', 'test.playwright')

// Find all TestFor*.spec.tsx files
const files = fs.readdirSync(specsDir).filter(f => f.startsWith('TestFor') && f.endsWith('.spec.tsx'))

console.log(`Found ${files.length} TestFor*.spec.tsx files to fix expectations`)

let fixedCount = 0

for (const file of files) {
    const filePath = path.join(specsDir, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // Check if file has the expectation pattern that needs div wrapper
    const bodyExpectMatch = /await expect\(innerHTML\)\.toBe\(['"]<h3>For/g
    if (bodyExpectMatch.test(content)) {
        // Replace expectations that test body innerHTML (which includes the wrapper)
        content = content.replace(
            /await expect\(innerHTML\)\.toBe\(['"]<h3>For - [^<]+<\/h3>(.+?)['"]\)/g,
            (match, content) => {
                return `await expect(innerHTML).toBe('<div><h3>For - ${content}</div>')`
            }
        )

        // Save the fixed content
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`Fixed expectations: ${file}`)
        fixedCount++
    } else {
        console.log(`Skipped (no body expectation pattern): ${file}`)
    }
}

console.log(`\nTotal fixed: ${fixedCount} out of ${files.length} files`)
