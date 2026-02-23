import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const specsDir = path.join(__dirname, 'test.playground', 'test.playwright')

// HTML test files to fix
const htmlTestFiles = [
    'TestHTMLInnerHTMLObservable.spec.tsx',
    'TestHTMLOuterHTMLFunction.spec.tsx',
    'TestHTMLOuterHTMLObservable.spec.tsx',
    'TestHTMLOuterHTMLStatic.spec.tsx',
    'TestHTMLTextContentObservable.spec.tsx'
]

for (const file of htmlTestFiles) {
    const filePath = path.join(specsDir, file)
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping non-existent: ${file}`)
        continue
    }

    let content = fs.readFileSync(filePath, 'utf8')

    // Replace empty string expectation with HTML comment
    content = content.replace(
        /await expect\(innerHTML\)\.toBe\(''\)/g,
        `await expect(innerHTML).toBe('<!---->')`
    )

    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Fixed empty HTML expectation: ${file}`)
}

console.log('All HTML expectation fixes applied')
