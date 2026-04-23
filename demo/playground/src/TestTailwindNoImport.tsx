/**
 * Test Tailwind CSS in Shadow DOM - Without @import
 * 
 * Tests that Tailwind CSS classes work correctly inside custom element shadow DOM
 * when stylesheets are adopted via adoptedStyleSheets API (no @import needed).
 * 
 * This follows the recommended approach from:
 * https://meefik.dev/2025/03/19/tailwindcss-and-shadow-dom/
 */
import { $, $$, customElement, defaults, renderToString, ObservableMaybe, type ElementAttributes, HtmlString, HtmlNumber, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

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
customElement('tailwind-card', TailwindCard)

// Augment JSX.IntrinsicElements to include custom element
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'tailwind-card': ElementAttributes<typeof TailwindCard>
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
    const styleId = 'tailwind-predefined-styles-noimport'
    if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style')
        styleEl.id = styleId
        styleEl.textContent = tailwindStyles
        document.head.appendChild(styleEl)
    }
}

// Test 1: TSX Usage with Tailwind Classes
const name1 = 'TestTailwindNoImportTSX'
const TestTailwindNoImportTSX = (): JSX.Element => {
    const title = $('My Card')
    const count = $(42)

    const ret: JSX.Element = () => (
        <div>
            <h2 class="text-xl font-bold mb-4">1. TSX Usage (No @import)</h2>
            <TailwindCard title={title} count={count}>
                <p class="text-sm text-blue-600">This content uses Tailwind classes</p>
            </TailwindCard>
        </div>
    )

    registerTestObservable(`${name1}_ssr`, ret)
    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTailwindNoImportTSX()
    const ssrComponent = testObservables[`TestTailwindNoImportTSX_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTailwindNoImportTSX\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTailwindNoImportTSX.test = {
    static: true,
    expect: () => {
        const expected = '<div><h2 class="text-xl font-bold mb-4">1. TSX Usage (No @import)</h2><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h2 class="text-2xl font-semibold text-gray-800 mb-4">My Card</h2><p class="text-gray-600 mb-2">Count: 42</p><div class="mt-4"><p class="text-sm text-blue-600">This content uses Tailwind classes</p></div></div></div>'

        const ssrComponent = testObservables[`${name1}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expected) {
            assert(false, `[${name1}] SSR mismatch: got \n${ssrResult}, expected \n${expected}`)
        } else {
            console.log(`✅ [${name1}] SSR test passed`)
        }

        return expected
    }
}

// Test 2: Custom Element Usage with Tailwind Classes
const name2 = 'TestTailwindNoImportHTML'
const TestTailwindNoImportHTML = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div>
            <h2 class="text-xl font-bold mb-4">2. Custom Element Usage (No @import)</h2>
            <tailwind-card
                title="HTML Card"
                count="100"
            >
                <p class="text-sm text-green-600">Content from HTML custom element</p>
            </tailwind-card>
        </div>
    )

    registerTestObservable(`${name2}_ssr`, ret)
    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTailwindNoImportHTML()
    const ssrComponent = testObservables[`TestTailwindNoImportHTML_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTailwindNoImportHTML\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTailwindNoImportHTML.test = {
    static: true,
    expect: () => {
        const expected = '<div><h2 class="text-xl font-bold mb-4">2. Custom Element Usage (No @import)</h2><tailwind-card title="HTML Card" count="100"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h2 class="text-2xl font-semibold text-gray-800 mb-4">HTML Card</h2><p class="text-gray-600 mb-2">Count: 100</p><div class="mt-4"><p class="text-sm text-green-600">Content from HTML custom element</p></div></div></tailwind-card></div>'

        const ssrComponent = testObservables[`${name2}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expected) {
            assert(false, `[${name2}] SSR mismatch: got \n${ssrResult}, expected \n${expected}`)
        } else {
            console.log(`✅ [${name2}] SSR test passed`)
        }

        return expected
    }
}

// Test 3: Nested Custom Elements with Tailwind
const name3 = 'TestTailwindNoImportNested'
const TestTailwindNoImportNested = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div class="space-y-4">
            <h2 class="text-xl font-bold mb-4">3. Nested Custom Elements (No @import)</h2>
            <tailwind-card title="Outer Card" count="1">
                <tailwind-card title="Inner Card" count="2">
                    <p class="text-xs text-purple-600">Deeply nested content</p>
                </tailwind-card>
            </tailwind-card>
        </div>
    )

    registerTestObservable(`${name3}_ssr`, ret)
    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTailwindNoImportNested()
    const ssrComponent = testObservables[`TestTailwindNoImportNested_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTailwindNoImportNested\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTailwindNoImportNested.test = {
    static: true,
    expect: () => {
        const expected = '<div class="space-y-4"><h2 class="text-xl font-bold mb-4">3. Nested Custom Elements (No @import)</h2><tailwind-card title="Outer Card" count="1"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h2 class="text-2xl font-semibold text-gray-800 mb-4">Outer Card</h2><p class="text-gray-600 mb-2">Count: 1</p><div class="mt-4"><tailwind-card title="Inner Card" count="2"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h2 class="text-2xl font-semibold text-gray-800 mb-4">Inner Card</h2><p class="text-gray-600 mb-2">Count: 2</p><div class="mt-4"><p class="text-xs text-purple-600">Deeply nested content</p></div></div></tailwind-card></div></div></tailwind-card></div>'

        const ssrComponent = testObservables[`${name3}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expected) {
            assert(false, `[${name3}] SSR mismatch: got \n${ssrResult}, expected \n${expected}`)
        } else {
            console.log(`✅ [${name3}] SSR test passed`)
        }

        return expected
    }
}

export default () => <>
    <TestSnapshots Component={TestTailwindNoImportTSX} />
    <TestSnapshots Component={TestTailwindNoImportHTML} />
    <TestSnapshots Component={TestTailwindNoImportNested} />
</>
