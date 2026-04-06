/**
 * Test Tailwind CSS in Shadow DOM - With @import (HTML Custom Elements)
 * 
 * Tests that Tailwind CSS classes work correctly inside custom element shadow DOM
 * using traditional @import approach.
 * 
 * Uses dangerouslySetInnerHTML to test pure HTML custom element usage.
 */
import { $, $$, customElement, defaults, renderToString, type ElementAttributes, HtmlString, HtmlNumber, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

// Define a custom element with Tailwind classes and dynamic variants
const TailwindButton = defaults(() => ({
    label: $('Click Me', HtmlString),
    variant: $('primary')
}), ({ label, variant }) => {
    // Dynamic class based on variant
    const variantClasses = () => {
        switch ($$(variant)) {
            case 'secondary':
                return 'bg-gray-500 hover:bg-gray-600 text-white'
            case 'danger':
                return 'bg-red-500 hover:bg-red-600 text-white'
            default:
                return 'bg-blue-500 hover:bg-blue-600 text-white'
        }
    }

    return (
        <button class={`px-4 py-2 rounded font-medium transition-colors ${variantClasses()}`}>
            {label}
        </button>
    )
})

// Register the custom element
customElement('tailwind-button-html', TailwindButton)

// Augment JSX.IntrinsicElements to include custom element
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'tailwind-button-html': ElementAttributes<typeof TailwindButton>
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
    const styleId = 'tailwind-predefined-styles-withimporthtml'
    if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style')
        styleEl.id = styleId
        styleEl.textContent = tailwindStyles
        document.head.appendChild(styleEl)
    }
}

// Test component using dangerouslySetInnerHTML for pure HTML testing
const name = 'TestTailwindWithImportHTMLPure'
const TestTailwindWithImportHTML = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h1>Tailwind CSS in Shadow DOM - With @import</h1>
            
            <h2>1. Button Variants</h2>
            <div class="space-x-2">
                <tailwind-button-html label="Primary Button" variant="primary"></tailwind-button-html>
                <tailwind-button-html label="Secondary Button" variant="secondary"></tailwind-button-html>
                <tailwind-button-html label="Danger Button" variant="danger"></tailwind-button-html>
            </div>

            <h2>2. Button Groups</h2>
            <div class="flex space-x-4">
                <div class="space-x-2">
                    <tailwind-button-html label="Action 1" variant="primary"></tailwind-button-html>
                    <tailwind-button-html label="Action 2" variant="primary"></tailwind-button-html>
                </div>
                <div class="space-x-2">
                    <tailwind-button-html label="Cancel" variant="secondary"></tailwind-button-html>
                    <tailwind-button-html label="Delete" variant="danger"></tailwind-button-html>
                </div>
            </div>

            <h2>3. Buttons with Layout Utilities</h2>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span class="text-gray-700 font-medium">Actions Panel</span>
                <div class="space-x-2">
                    <tailwind-button-html label="Save" variant="primary"></tailwind-button-html>
                    <tailwind-button-html label="Discard" variant="secondary"></tailwind-button-html>
                </div>
            </div>

            <h2>4. Vertical Button Stack</h2>
            <div class="space-y-2 max-w-xs">
                <tailwind-button-html label="Dashboard" variant="primary"></tailwind-button-html>
                <tailwind-button-html label="Settings" variant="secondary"></tailwind-button-html>
                <tailwind-button-html label="Logout" variant="danger"></tailwind-button-html>
            </div>

            <h2>5. Button Grid Layout</h2>
            <div class="grid grid-cols-3 gap-3">
                <tailwind-button-html label="Grid 1" variant="primary"></tailwind-button-html>
                <tailwind-button-html label="Grid 2" variant="secondary"></tailwind-button-html>
                <tailwind-button-html label="Grid 3" variant="danger"></tailwind-button-html>
                <tailwind-button-html label="Grid 4" variant="primary"></tailwind-button-html>
                <tailwind-button-html label="Grid 5" variant="secondary"></tailwind-button-html>
                <tailwind-button-html label="Grid 6" variant="danger"></tailwind-button-html>
            </div>

            <h2>6. Mixed Content with Buttons</h2>
            <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Control Panel</h3>
                <p class="text-gray-600 mb-4">Select an action below:</p>
                <div class="flex flex-wrap gap-2">
                    <tailwind-button-html label="Export" variant="primary"></tailwind-button-html>
                    <tailwind-button-html label="Import" variant="secondary"></tailwind-button-html>
                    <tailwind-button-html label="Reset" variant="danger"></tailwind-button-html>
                </div>
            </div>

            <h2>7. Responsive Button Layout</h2>
            <div class="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
                <tailwind-button-html label="Mobile First" variant="primary"></tailwind-button-html>
                <tailwind-button-html label="Responsive" variant="secondary"></tailwind-button-html>
                <tailwind-button-html label="Layout" variant="danger"></tailwind-button-html>
            </div>
            `}}>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

export const TestWrapper = () => {
    return () => <TestTailwindWithImportHTML />
}

TestWrapper.test = {
    static: true,
    expect: () => {
        // Define expected HTML structure
        const expected = minimiseHtml(`<div>
    <h1>Tailwind CSS in Shadow DOM - With @import</h1>
    
    <h2>1. Button Variants</h2>
    <div class="space-x-2">
        <tailwind-button-html label="Primary Button" variant="primary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Primary Button</button>
        </tailwind-button-html>
        <tailwind-button-html label="Secondary Button" variant="secondary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Secondary Button</button>
        </tailwind-button-html>
        <tailwind-button-html label="Danger Button" variant="danger">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Danger Button</button>
        </tailwind-button-html>
    </div>

    <h2>2. Button Groups</h2>
    <div class="flex space-x-4">
        <div class="space-x-2">
            <tailwind-button-html label="Action 1" variant="primary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Action 1</button>
            </tailwind-button-html>
            <tailwind-button-html label="Action 2" variant="primary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Action 2</button>
            </tailwind-button-html>
        </div>
        <div class="space-x-2">
            <tailwind-button-html label="Cancel" variant="secondary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Cancel</button>
            </tailwind-button-html>
            <tailwind-button-html label="Delete" variant="danger">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Delete</button>
            </tailwind-button-html>
        </div>
    </div>

    <h2>3. Buttons with Layout Utilities</h2>
    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span class="text-gray-700 font-medium">Actions Panel</span>
        <div class="space-x-2">
            <tailwind-button-html label="Save" variant="primary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Save</button>
            </tailwind-button-html>
            <tailwind-button-html label="Discard" variant="secondary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Discard</button>
            </tailwind-button-html>
        </div>
    </div>

    <h2>4. Vertical Button Stack</h2>
    <div class="space-y-2 max-w-xs">
        <tailwind-button-html label="Dashboard" variant="primary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Dashboard</button>
        </tailwind-button-html>
        <tailwind-button-html label="Settings" variant="secondary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Settings</button>
        </tailwind-button-html>
        <tailwind-button-html label="Logout" variant="danger">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Logout</button>
        </tailwind-button-html>
    </div>

    <h2>5. Button Grid Layout</h2>
    <div class="grid grid-cols-3 gap-3">
        <tailwind-button-html label="Grid 1" variant="primary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Grid 1</button>
        </tailwind-button-html>
        <tailwind-button-html label="Grid 2" variant="secondary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Grid 2</button>
        </tailwind-button-html>
        <tailwind-button-html label="Grid 3" variant="danger">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Grid 3</button>
        </tailwind-button-html>
        <tailwind-button-html label="Grid 4" variant="primary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Grid 4</button>
        </tailwind-button-html>
        <tailwind-button-html label="Grid 5" variant="secondary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Grid 5</button>
        </tailwind-button-html>
        <tailwind-button-html label="Grid 6" variant="danger">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Grid 6</button>
        </tailwind-button-html>
    </div>

    <h2>6. Mixed Content with Buttons</h2>
    <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-4">Control Panel</h3>
        <p class="text-gray-600 mb-4">Select an action below:</p>
        <div class="flex flex-wrap gap-2">
            <tailwind-button-html label="Export" variant="primary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Export</button>
            </tailwind-button-html>
            <tailwind-button-html label="Import" variant="secondary">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Import</button>
            </tailwind-button-html>
            <tailwind-button-html label="Reset" variant="danger">
                <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Reset</button>
            </tailwind-button-html>
        </div>
    </div>

    <h2>7. Responsive Button Layout</h2>
    <div class="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
        <tailwind-button-html label="Mobile First" variant="primary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white">Mobile First</button>
        </tailwind-button-html>
        <tailwind-button-html label="Responsive" variant="secondary">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white">Responsive</button>
        </tailwind-button-html>
        <tailwind-button-html label="Layout" variant="danger">
            <button class="px-4 py-2 rounded font-medium transition-colors bg-red-500 hover:bg-red-600 text-white">Layout</button>
        </tailwind-button-html>
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
