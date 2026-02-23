import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Fix escaping issues in TestNestedArrays.spec.tsx - remove the 1 test
const filePath = path.join(__dirname, 'test.playground', 'test.playwright', 'TestNestedArrays.spec.tsx')
let content = fs.readFileSync(filePath, 'utf8')

// Replace the problematic assertion that contains unescaped '1'
content = content.replace(
    /await expect\(innerHTML\.includes\('1'\)\)\.toBeTruthy\(\)\)/g,
    "await expect(innerHTML.includes('1')).toBeTruthy()"
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('Fixed escaping issue in TestNestedArrays.spec.tsx')
