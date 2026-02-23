import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const specsDir = path.join(__dirname, 'test.playground', 'test.playwright')

// Find all TestFor*.spec.tsx files
const files = fs.readdirSync(specsDir).filter(f => f.startsWith('TestFor') && f.endsWith('.spec.tsx'))

console.log(`Found ${files.length} TestFor*.spec.tsx files to fix broken expectations`)

let fixedCount = 0

for (const file of files) {
    const filePath = path.join(specsDir, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // Fix broken expectations where h3 content was cut off
    // Pattern: '<div><h3>For - <p>Value:' -> '<div><h3>For - TESTNAME</h3><p>Value:'
    const brokenPattern = /await expect\(innerHTML\)\.toBe\('<div><h3>For - <p>Value:/g
    if (brokenPattern.test(content)) {
        // Extract the test title from the header line
        const titleMatch = content.match(/test\('For - (.+?) component'/)
        if (titleMatch) {
            const title = titleMatch[1]
            console.log(`Recovering h3 title for ${title}`)

            content = content.replace(
                /await expect\(innerHTML\)\.toBe\('<div><h3>For - (.*?)<p>Value:/g,
                `await expect(innerHTML).toBe('<div><h3>For - ${title}</h3><p>Value:`
            )

            fs.writeFileSync(filePath, content, 'utf8')
            console.log(`  Fixed expectation: ${file}`)
            fixedCount++
        }
    }
}

console.log(`\nTotal fixed: ${fixedCount} files with broken expectations`)

// Now verify tests still pass basic structure check
for (const file of files) {
    const filePath = path.join(specsDir, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // Check if there's just a structure check without actual expectation (from random tests)
    if (content.includes('await expect(paragraphs.length).toBeGreaterThanOrEqual(3)') && content.includes('random()')) {
        console.log(`Note: ${file} uses structural check pattern for random values (this is ok)`)
    }
}
