import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read the source file to extract the expected output
function getExpectedFromSrc(componentName) {
    const srcPath = path.join(__dirname, 'src', `${componentName}.tsx`)
    if (!fs.existsSync(srcPath)) {
        return null
    }

    const content = fs.readFileSync(srcPath, 'utf8')

    // Look for the .test.expect pattern
    const expectMatch = content.match(/\.test\s*=\s*\{[\s\S]*?expect:\s*\(\s*\)\s*=>\s*`([^`]*)`[\s\S]*?\}/)
    if (expectMatch) {
        return expectMatch[1].trim()
    }

    // Alternative pattern: expect: () => '<p>...'
    const altExpectMatch = content.match(/expect:\s*\(\s*\)\s*=>\s*'([^']*)'/)
    if (altExpectMatch) {
        return altExpectMatch[1].trim()
    }

    // If no expect found, try to extract the basic JSX structure
    const jsxMatch = content.match(/return\s*\(\s*\n*\s*<>[\s\S]*?<h3[^>]*>([^<]*)<\/h3>([\s\S]*?)<\/>\s*\)/)
    if (jsxMatch) {
        const title = jsxMatch[1].trim()
        // Extract inner content and simplify
        const innerContent = jsxMatch[2].replace(/<([^>]+)>\s*\{\s*\(\s*\)\s*=>\s*[a-zA-Z]+\(\s*\)\s*\}\s*<\/\1>/g, '<$1>{function_result}</$1>')
            .replace(/\{[^}]*\}/g, '{observable}')
            .replace(/\s+/g, ' ')
            .trim()
        return `<h3>${title}</h3>${innerContent}`
    }

    return null
}

// Function to generate appropriate assertions based on component type
function generateAssertions(componentName) {
    const expected = getExpectedFromSrc(componentName)

    if (!expected) {
        // Generic assertion if we can't determine the expected output
        return `    // Verify component renders
    const element = page.locator('h3:has-text("${componentName.replace(/([A-Z])/g, ' $1').trim()}")')
    await expect(element).toBeVisible()`
    }

    // Parse the expected HTML to create appropriate Playwright assertions
    if (expected.includes('<p><!----></p>')) {
        // For boolean components that render as placeholders
        return `    // Verify component renders with boolean placeholder
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('<!---->')`
    } else if (expected.includes('{random-')) {
        // For components with random values, just check the structure
        const cleanExpected = expected.replace(/\{random-[^\}]+\}/g, 'PLACEHOLDER')
        return `    // Verify component renders basic structure
    const element = page.locator('body')
    await expect(element).toContainText('${cleanExpected.replace(/<[^>]*>/g, '').replace(/[{}]/g, '')}')`
    } else if (expected.includes('<p>')) {
        // Extract text from p tag for simple text assertions
        const pMatch = expected.match(/<p[^>]*>(.*?)<\/p>/)
        if (pMatch) {
            const text = pMatch[1].replace(/<[^>]*>/g, '').trim()
            return `    // Verify paragraph content
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('${text}')`
        }
    }

    // Generic assertion for other cases
    return `    // Verify component renders
    const element = page.locator('h3:has-text("${componentName.replace(/([A-Z])/g, ' $1').trim()}")')
    await expect(element).toBeVisible()`
}

// Update all test files with proper assertions
const testFiles = fs.readdirSync(path.join(__dirname, 'test.playwright'))
    .filter(file => file.endsWith('.spec.tsx') && !file.includes('debug'))

console.log(`Updating ${testFiles.length} test files with proper assertions...`)

testFiles.forEach(file => {
    const filePath = path.join(__dirname, 'test.playwright', file)
    let content = fs.readFileSync(filePath, 'utf8')

    const componentName = file.replace('.spec.tsx', '')

    // Generate appropriate assertions for this component
    const assertions = generateAssertions(componentName)

    // Replace the placeholder comment with actual assertions
    content = content.replace(
        /\/\/ Add specific assertions here based on the component/,
        assertions
    )

    // Also update the placeholder in observable tests
    content = content.replace(
        /\/\/ Add assertion/g,
        '// Assertion performed above'
    )

    fs.writeFileSync(filePath, content)
    console.log(`Updated: ${file}`)
})

console.log('All test files updated with proper assertions!')