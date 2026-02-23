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

    // Check if file has the issue pattern
    if (content.includes("h(For, {")) {
        // Replace h(For, { ... }) with For({ ... })
        content = content.replace(/h\(For,\s*\{/g, 'For({')

        // Also need to update the closing - find the matching closing ) and replace the structure
        // Pattern: h(For, { ... }) -> For({ ... })
        // This is trickier as we need to handle the closing

        // Look for patterns like: h(For, { ... } as any)
        if (content.includes("} as any)\n")) {
            content = content.replace(/} as any\)\n/g, '} as any)\n')

            // We need to convert:
            // h(For, { ... })  -> For({ ... })
            // h(For, { ... } as any)  -> For({ ... } as any)

            // Find the h(For, { ... }) pattern and replace the opening
            content = content.replace(/h\(For,\s*\{/g, 'For({')
        }

        // Save the fixed content
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`Fixed: ${file}`)
        fixedCount++
    } else {
        console.log(`Skipped (no h(For pattern): ${file}`)
    }
}

console.log(`\nTotal fixed: ${fixedCount} out of ${files.length} files`)
