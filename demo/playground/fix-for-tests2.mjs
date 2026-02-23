import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const specsDir = path.join(__dirname, 'test.playground', 'test.playwright')

// Find all TestFor*.spec.tsx files
const files = fs.readdirSync(specsDir).filter(f => f.startsWith('TestFor') && f.endsWith('.spec.tsx'))

console.log(`Found ${files.length} TestFor*.spec.tsx files to fix`)

let fixedCount = 0

for (const file of files) {
    const filePath = path.join(specsDir, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // Check if file still has h(For pattern
    const hasHForPattern = /h\(For,\s*\{[\s\S]*?\}\s*(?:as any)?\)/.test(content)

    if (hasHForPattern) {
        // Replace h(For, { ... }) with For({ ... })
        // Using a regex that handles multi-line content
        content = content.replace(
            /h\(For,\s*\{([\s\S]*?)\}\s*(?:as any)?\)/g,
            'For({$1})'
        )

        // Save the fixed content
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`Fixed: ${file}`)
        fixedCount++
    } else {
        console.log(`Skipped (no h(For pattern): ${file}`)
    }
}

console.log(`\nTotal fixed: ${fixedCount} out of ${files.length} files`)
