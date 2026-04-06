/**
 * Test Tailwind CSS in Shadow DOM - Without @import (HTML Custom Elements)
 * 
 * Tests that Tailwind CSS classes work correctly inside custom element shadow DOM
 * when stylesheets are adopted via adoptedStyleSheets API.
 * 
 * Uses dangerouslySetInnerHTML to test pure HTML custom element usage.
 * This is the recommended approach per:
 * https://meefik.dev/2025/03/19/tailwindcss-and-shadow-dom/
 */
import { $, $$, customElement, defaults, renderToString, type ElementAttributes, HtmlString, HtmlNumber, type JSX, useEffect } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, minimiseHtml, printShadowComputedStyles, getShadowComputedStyleValue, getSlottedComputedStyleValue } from './util'

// Define a custom element with Tailwind classes
const TailwindCard = defaults(() => ({
    title: $('Tailwind Card', HtmlString),
    count: $(0, HtmlNumber)
}), ({ title, count, children }) => {
    return (
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
            <p class="text-gray-600 mb-2">Count: {count}</p>
            <div class="mt-4">{children}</div>
        </div>
    )
})

// Register the custom element
customElement('tailwind-card-html', TailwindCard)

// Augment JSX.IntrinsicElements to include custom element
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'tailwind-card-html': ElementAttributes<typeof TailwindCard>
        }
    }
}

// Predefined Tailwind CSS classes (since Tailwind is not installed)
const tailwindStyles = `
/* Layout & Display */
.flex { display: flex; }
.grid { display: grid; }
.block { display: block; }
.inline { display: inline; }

/* Flexbox */
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.flex-wrap { flex-wrap: wrap; }
.flex-col { flex-direction: column; }

/* Grid */
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }

/* Spacing - Padding */
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }

/* Spacing - Margin */
.m-4 { margin: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }
.ml-20 { margin-left: 5rem; }

/* Spacing - Space Between */
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-4 > * + * { margin-top: 1rem; }

/* Typography - Size */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }

/* Typography - Weight */
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Typography - Color */
.text-gray-500 { color: rgb(107 114 128); }
.text-gray-600 { color: rgb(75 85 99); }
.text-gray-700 { color: rgb(55 65 81); }
.text-gray-800 { color: rgb(31 41 55); }
.text-gray-900 { color: rgb(17 24 39); }
.text-blue-600 { color: rgb(37 99 235); }
.text-green-600 { color: rgb(22 163 74); }
.text-purple-600 { color: rgb(147 51 234); }
.text-white { color: rgb(255 255 255); }

/* Background Colors */
.bg-white { background-color: rgb(255 255 255); }
.bg-gray-50 { background-color: rgb(249 250 251); }
.bg-blue-500 { background-color: rgb(59 130 246); }
.bg-gray-500 { background-color: rgb(107 114 128); }
.bg-red-500 { background-color: rgb(239 68 68); }

/* Hover States */
.hover\:bg-blue-600:hover { background-color: rgb(37 99 235); }
.hover\:bg-gray-600:hover { background-color: rgb(75 85 99); }
.hover\:bg-red-600:hover { background-color: rgb(220 38 38); }

/* Borders */
.border { border-width: 1px; }
.border-gray-200 { border-color: rgb(229 231 235); }

/* Border Radius */
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }

/* Shadow */
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }

/* Transitions */
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

/* Sizing */
.max-w-xs { max-width: 20rem; }

/* Responsive */
@media (min-width: 640px) {
    .sm\:flex-row { flex-direction: row; }
    .sm\:justify-center { justify-content: center; }
    .sm\:space-x-4 > * + * { margin-left: 1rem; }
    .sm\:space-y-0 > * + * { margin-top: 0; }
}
`

// Inject styles into document
if (typeof document !== 'undefined') {
    const styleId = 'tailwind-predefined-styles-noimporthtml'
    if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style')
        styleEl.id = styleId
        styleEl.textContent = tailwindStyles
        document.head.appendChild(styleEl)
    }
}

// Test component using dangerouslySetInnerHTML for pure HTML testing
const name = 'TestTailwindNoImportHTMLPure'
const TestTailwindNoImportHTML = (): JSX.Element => {
    // Run computed style tests after component mounts
    const ref = $()
   
    useEffect(() => {
        if (typeof document === 'undefined') return
        if(!$$(ref))return
        
        // Wait for next frame to ensure rendering is complete
        requestAnimationFrame(() => {
            console.log('\n=== Computed Style Tests ===')
            
            // Test 1: Check first card's h2 element
            const card1H2Styles = printShadowComputedStyles(
                'tailwind-card-html',
                'h2',
                ['font-size', 'font-weight', 'color', 'padding', 'margin-bottom']
            )
            
            // Verify typography
            const fontSize = getShadowComputedStyleValue('tailwind-card-html', 'h2', 'font-size')
            const fontWeight = getShadowComputedStyleValue('tailwind-card-html', 'h2', 'font-weight')
            const color = getShadowComputedStyleValue('tailwind-card-html', 'h2', 'color')
            
            console.log('\n📊 Typography Verification:')
            console.log(`  font-size: ${fontSize} (expected: 24px for text-2xl)`)
            console.log(`  font-weight: ${fontWeight} (expected: 600 for font-semibold)`)
            console.log(`  color: ${color} (expected: rgb(31 41 55) for text-gray-800)`)
            
            // Test assertions
            if (fontSize === '24px') {
                console.log('  ✅ Font size correct')
            } else {
                console.error(`  ❌ Font size mismatch: got ${fontSize}, expected 24px`)
            }
            
            if (fontWeight === '600') {
                console.log('  ✅ Font weight correct')
            } else {
                console.error(`  ❌ Font weight mismatch: got ${fontWeight}, expected 600`)
            }
            
            if (color && (color.includes('31, 41, 55') || color.includes('31 41 55'))) {
                console.log('  ✅ Text color correct')
            } else {
                console.error(`  ❌ Text color mismatch: got ${color}, expected rgb(31 41 55)`)
            }
            
            // Test 2: Check card container background and padding
            const cardBg = getShadowComputedStyleValue('tailwind-card-html', 'div.bg-white', 'background-color')
            const cardPadding = getShadowComputedStyleValue('tailwind-card-html', 'div.bg-white', 'padding')
            const cardBorderRadius = getShadowComputedStyleValue('tailwind-card-html', 'div.bg-white', 'border-radius')
            
            console.log('\n🎨 Card Container Styles:')
            console.log(`  background-color: ${cardBg} (expected: rgb(255, 255, 255))`)
            console.log(`  padding: ${cardPadding} (expected: 24px for p-6)`)
            console.log(`  border-radius: ${cardBorderRadius} (expected: 8px for rounded-lg)`)
            
            if (cardBg && (cardBg.includes('255, 255, 255') || cardBg === 'rgb(255, 255, 255)')) {
                console.log('  ✅ Background color correct')
            } else {
                console.error(`  ❌ Background color mismatch: got ${cardBg}, expected rgb(255, 255, 255)`)
            }
            
            if (cardPadding === '24px') {
                console.log('  ✅ Padding correct')
            } else {
                console.error(`  ❌ Padding mismatch: got ${cardPadding}, expected 24px`)
            }
            
            if (cardBorderRadius === '8px') {
                console.log('  ✅ Border radius correct')
            } else {
                console.error(`  ❌ Border radius mismatch: got ${cardBorderRadius}, expected 8px`)
            }
            // Test 3: Check blue text color (slotted content)
            const blueText = getSlottedComputedStyleValue('tailwind-card-html', 'p.text-blue-600', 'color')
            console.log(`\n💙 Blue Text Color (slotted): ${blueText} (expected: rgb(37, 99, 235))`)
            
            if (blueText && (blueText.includes('37, 99, 235') || blueText.includes('37 99 235'))) {
                console.log('  ✅ Blue color correct')
            } else {
                console.error(`  ❌ Blue color mismatch: got ${blueText}, expected rgb(37, 99, 235)`)
            }
            
            console.log('\n=== End Computed Style Tests ===\n')
        })
    }, [])
    
    const ret: JSX.Element = () => (
        <div ref={ref} dangerouslySetInnerHTML={{
            __html: `
            <h1>Tailwind CSS in Shadow DOM - No @import</h1>
            
            <h2>1. Basic Card Custom Element</h2>
            <tailwind-card-html title="Basic Card" count="42">
                <p class="text-sm text-blue-600">Basic content with Tailwind classes</p>
            </tailwind-card-html>

            <h2>2. Multiple Cards Side by Side</h2>
            <div class="flex space-x-4">
                <tailwind-card-html title="Card 1" count="10"></tailwind-card-html>
                <tailwind-card-html title="Card 2" count="20"></tailwind-card-html>
                <tailwind-card-html title="Card 3" count="30"></tailwind-card-html>
            </div>

            <h2>3. Nested Cards</h2>
            <tailwind-card-html title="Outer Card" count="1">
                <tailwind-card-html title="Middle Card" count="2">
                    <tailwind-card-html title="Inner Card" count="3">
                        <p class="text-xs text-purple-600">Deeply nested content</p>
                    </tailwind-card-html>
                </tailwind-card-html>
            </tailwind-card-html>

            <h2>4. Card with Various Typography Classes</h2>
            <tailwind-card-html title="Typography Test" count="99">
                <p class="text-xs text-gray-500">Extra small text</p>
                <p class="text-sm text-gray-600">Small text</p>
                <p class="text-base text-gray-700">Base text</p>
                <p class="text-lg text-gray-800">Large text</p>
                <p class="text-xl font-bold text-gray-900">Extra large bold text</p>
            </tailwind-card-html>

            <h2>5. Card Layout Variations</h2>
            <div class="grid grid-cols-2 gap-4">
                <tailwind-card-html title="Grid Item 1" count="100"></tailwind-card-html>
                <tailwind-card-html title="Grid Item 2" count="200"></tailwind-card-html>
            </div>

            <h2>6. Card with Spacing Utilities</h2>
            <div class="space-y-4">
                <tailwind-card-html title="First Card" count="1"></tailwind-card-html>
                <tailwind-card-html title="Second Card" count="2"></tailwind-card-html>
                <tailwind-card-html title="Third Card" count="3"></tailwind-card-html>
            </div>
            `}}>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

export const TestWrapper = () => {
    return () => <TestTailwindNoImportHTML />
}

TestWrapper.test = {
    static: true,
    expect: () => {
        // Define expected HTML structure
        const expected = minimiseHtml(`<div>
    <h1>Tailwind CSS in Shadow DOM - No @import</h1>
    
    <h2>1. Basic Card Custom Element</h2>
    <tailwind-card-html title="Basic Card" count="42">
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Basic Card</h2>
            <p class="text-gray-600 mb-2">Count: 42</p>
            <div class="mt-4">
                <p class="text-sm text-blue-600">Basic content with Tailwind classes</p>
            </div>
        </div>
    </tailwind-card-html>

    <h2>2. Multiple Cards Side by Side</h2>
    <div class="flex space-x-4">
        <tailwind-card-html title="Card 1" count="10">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Card 1</h2>
                <p class="text-gray-600 mb-2">Count: 10</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
        <tailwind-card-html title="Card 2" count="20">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Card 2</h2>
                <p class="text-gray-600 mb-2">Count: 20</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
        <tailwind-card-html title="Card 3" count="30">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Card 3</h2>
                <p class="text-gray-600 mb-2">Count: 30</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
    </div>

    <h2>3. Nested Cards</h2>
    <tailwind-card-html title="Outer Card" count="1">
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Outer Card</h2>
            <p class="text-gray-600 mb-2">Count: 1</p>
            <div class="mt-4">
                <tailwind-card-html title="Middle Card" count="2">
                    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Middle Card</h2>
                        <p class="text-gray-600 mb-2">Count: 2</p>
                        <div class="mt-4">
                            <tailwind-card-html title="Inner Card" count="3">
                                <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Inner Card</h2>
                                    <p class="text-gray-600 mb-2">Count: 3</p>
                                    <div class="mt-4">
                                        <p class="text-xs text-purple-600">Deeply nested content</p>
                                    </div>
                                </div>
                            </tailwind-card-html>
                        </div>
                    </div>
                </tailwind-card-html>
            </div>
        </div>
    </tailwind-card-html>

    <h2>4. Card with Various Typography Classes</h2>
    <tailwind-card-html title="Typography Test" count="99">
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Typography Test</h2>
            <p class="text-gray-600 mb-2">Count: 99</p>
            <div class="mt-4">
                <p class="text-xs text-gray-500">Extra small text</p>
                <p class="text-sm text-gray-600">Small text</p>
                <p class="text-base text-gray-700">Base text</p>
                <p class="text-lg text-gray-800">Large text</p>
                <p class="text-xl font-bold text-gray-900">Extra large bold text</p>
            </div>
        </div>
    </tailwind-card-html>

    <h2>5. Card Layout Variations</h2>
    <div class="grid grid-cols-2 gap-4">
        <tailwind-card-html title="Grid Item 1" count="100">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Grid Item 1</h2>
                <p class="text-gray-600 mb-2">Count: 100</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
        <tailwind-card-html title="Grid Item 2" count="200">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Grid Item 2</h2>
                <p class="text-gray-600 mb-2">Count: 200</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
    </div>

    <h2>6. Card with Spacing Utilities</h2>
    <div class="space-y-4">
        <tailwind-card-html title="First Card" count="1">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">First Card</h2>
                <p class="text-gray-600 mb-2">Count: 1</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
        <tailwind-card-html title="Second Card" count="2">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Second Card</h2>
                <p class="text-gray-600 mb-2">Count: 2</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
        <tailwind-card-html title="Third Card" count="3">
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Third Card</h2>
                <p class="text-gray-600 mb-2">Count: 3</p>
                <div class="mt-4"></div>
            </div>
        </tailwind-card-html>
    </div>
</div>`)

        // SSR test
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)

        if (ssrResult !== expected) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expected}`)
        } else {
            console.log(`✅ [${name}] SSR test passed`)
        }

        return expected
    }
}

export default TestWrapper
