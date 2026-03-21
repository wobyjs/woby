/**
 * TestNativeCustomElementSource
 * 
 * This test demonstrates that woby can work with custom elements
 * registered by other libraries (not using woby's customElement() function).
 * 
 * The native custom element is registered directly with customElements.define(),
 * simulating how React, Lit, or other frameworks would register their elements.
 * 
 * Woby's wobyCustomElements.get() should fall back to the native registry
 * for tags not owned by woby, allowing seamless interoperability.
 */

import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

const name = 'TestNativeCustomElementSource'

// Register a native custom element directly (simulating another library)
class NativeCustomElement extends HTMLElement {
    static observedAttributes = ['value', 'label']

    constructor() {
        super()
        console.log('[NativeCustomElement] Constructor called')

        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
            <style>
                .container {
                    padding: 16px;
                    border: 2px solid #3498db;
                    border-radius: 8px;
                    background: #ecf0f1;
                }
                .label { font-weight: bold; color: #2c3e50; }
                .value { color: #e74c3c; font-size: 1.2em; }
            </style>
            <div class="container">
                <div class="label"></div>
                <div class="value"></div>
                <slot></slot>
            </div>
        `
    }

    connectedCallback() {
        console.log('[NativeCustomElement] Connected')
        this.updateDisplay()
        // Per W3C spec, light DOM children stay in the light DOM and are projected via <slot>
        // No need to copy or duplicate the content
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.updateDisplay()
        }
    }

    private updateDisplay() {
        const label = this.getAttribute('label') || 'Native Element'
        const value = this.getAttribute('value') || 'N/A'

        const shadow = this.shadowRoot
        if (shadow) {
            shadow.querySelector('.label')!.textContent = label
            shadow.querySelector('.value')!.textContent = value
        }
    }
}

globalThis.customElements.define('native-custom-element', NativeCustomElement)

// Register with native customElements API (NOT woby's customElement())
const NATIVE_TAG_NAME = 'native-custom-element'
if (!customElements.get(NATIVE_TAG_NAME)) {
    customElements.define(NATIVE_TAG_NAME, NativeCustomElement)
    console.log(`[TestNativeCustomElementSource] Registered ${NATIVE_TAG_NAME} with native customElements`)
}

// Woby component that uses the native custom element
const TestNativeCustomElementSource = (): JSX.Element => {
    const label = $('Native Element Test')
    const value = $('42')
    const updateCount = $(0)

    const ret: JSX.Element = () => {
        console.log('[TestNativeCustomElementSource] Rendering')

        return (
            <div dangerouslySetInnerHTML={{
                __html: `
            <div>
                <h3>Native Custom Element Source Test</h3>
                <p>This test uses a custom element registered with native customElements.define(), not woby's customElement().</p>

                <native-custom-element label="${label()}" value="${value()}">Hello native customElement</native-custom-element>
            </div>

    ` }}></div>
        )
    }

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestNativeCustomElementSource.test = {
    static: true,
    expect: () => {
        // DOM expectation (browser rendering - no shadow DOM serialization)
        const domExpected = '<div><div><p>This test uses a custom element registered with native customElements.define(), not woby\'s customElement().</p><native-custom-element label="Native Element Test" value="42"><template shadowrootmode="open" shadowrootserializable=""><style> .container { padding: 16px; border: 2px solid #3498db; border-radius: 8px; background: #ecf0f1; } .label { font-weight: bold; color: #2c3e50; } .value { color: #e74c3c; font-size: 1.2em; } </style><div class="container"><div class="label">Native Element Test</div><div class="value">42</div><slot>Hello native customElement</slot></div></template></native-custom-element></div></div>'

        // SSR expectation - same as DOM, no shadow DOM serialization in renderToString
        const ssrExpected = '<div><div><h3>Native Custom Element Source Test</h3><p>This test uses a custom element registered with native customElements.define(), not woby\'s customElement().</p><native-custom-element label="Native Element Test" value="42">Hello native customElement</native-custom-element></div></div>'

        const ssrComponent = testObservables[`${name}_ssr`]
        if (!ssrComponent) {
            assert(false, `[${name}] SSR component not registered`)
            return domExpected
        }

        const ssrResult = minimiseHtml(renderToString(ssrComponent))

        if (ssrResult !== minimiseHtml(ssrExpected)) {
            assert(false, `[${name}] SSR mismatch:\ngot \n${ssrResult}\nexpected \n${ssrExpected}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return domExpected
    }
}

export default () => <TestSnapshots Component={TestNativeCustomElementSource} />
