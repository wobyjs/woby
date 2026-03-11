/* IMPORT */

import * as Woby from 'woby'
import type { JSX, Observable } from 'woby'
import { useEffect, $, } from 'woby'

globalThis.Woby = Woby

/* TYPE */

type Constructor<T, Args extends unknown[] = unknown[]> = new (...args: Args) => T

type FunctionUnwrap<T> = T extends ({ (): infer U }) ? U : T

/* HELPERS */

export const TEST_INTERVAL = 500 // Lowering this makes it easier to spot some memory leaks

export const assert = (result: boolean, message?: string): void => {
    console.assert(result, message)
}

export const random = (): number => { // It's important for testing that 0, 1 or reused numbers are never returned
    const value = Math.random()
    if (value === 0 || value === 1) return random()
    return value
}

export const randomBigInt = (): bigint => {
    return BigInt(Math.floor(random() * 100))
}

export const randomColor = (): string => {
    return `#${Math.floor(random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
}

// Global test observables registry
export const testObservables: Record<string, Observable<any> | JSX.Child> = {}

// Expose testObservables globally for testing
if (typeof window !== 'undefined') {
    (window as any).testObservables = testObservables
}

export const registerTestObservable = (name: string, observable: Observable<any> | JSX.Child) => {
    testObservables[name] = observable
}

/**
 * Serializes an element to HTML string, recursively handling shadow DOM.
 * For custom elements with shadowRoot: wraps shadow content in <template shadowrootmode="open">,
 * then appends only light DOM children that are NOT assigned to any slot (hidden from output).
 * Falls back to element.innerHTML for elements without shadow DOM.
 */
export function getInnerHTML(element: Element): string {
    if (!element) return ''
    return _serializeChildren(element)
}
export function minimiseHtml(html: string): string {
    return html.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
}

function _serializeElement(el: Element): string {
    const shadowRoot = (el as any).shadowRoot as ShadowRoot | null

    if (shadowRoot) {
        // Open tag
        const tag = el.tagName.toLowerCase()
        let attrs = ''
        for (let i = 0; i < el.attributes.length; i++) {
            const a = el.attributes[i]
            attrs += ` ${a.name}="${a.value}"`
        }

        // Shadow DOM: emit <template shadowrootmode="open"> with shadow content
        // <slot> elements inside will be replaced with assignedNodes() content
        let inner = `<template shadowrootmode="open" shadowrootserializable="">`
        inner += _serializeShadowRoot(shadowRoot)
        inner += `</template>`

        return `<${tag}${attrs}>${inner}</${tag}>`
    }

    // No shadow root: regular element — recurse into children
    const tag = el.tagName.toLowerCase()
    let attrs = ''
    for (let i = 0; i < el.attributes.length; i++) {
        const a = el.attributes[i]
        attrs += ` ${a.name}="${a.value}"`
    }
    return `<${tag}${attrs}>${_serializeChildren(el)}</${tag}>`
}

function _serializeShadowRoot(shadowRoot: ShadowRoot): string {
    let html = ''
    shadowRoot.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element
            if (el.tagName === 'SLOT') {
                // Keep <slot> tag, populate with assignedNodes() content inside it
                let slotContent = ''
                const assigned = (el as HTMLSlotElement).assignedNodes({ flatten: true })
                assigned.forEach((assignedNode) => {
                    if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                        slotContent += _serializeElement(assignedNode as Element)
                    } else if (assignedNode.nodeType === Node.TEXT_NODE) {
                        slotContent += (assignedNode as Text).textContent || ''
                    }
                })
                html += `<slot>${slotContent}</slot>`
            } else {
                // Pass shadowRoot as slotContext so nested <slot> inside e.g. <div> can be resolved
                html += _serializeElementWithSlot(el, shadowRoot)
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            html += (node as Text).textContent || ''
        }
    })
    return html
}

function _serializeChildren(element: Element, slotContext?: ShadowRoot): string {
    let html = ''
    element.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element
            // Only process <slot> elements if we have a shadow context (shadow DOM)
            // Otherwise, skip <slot> elements entirely (SSR mode without shadow DOM)
            if (el.tagName === 'SLOT' && slotContext) {
                // Keep <slot> tag, populate with assignedNodes() content inside it
                let slotContent = ''
                const assigned = (el as HTMLSlotElement).assignedNodes({ flatten: true })
                assigned.forEach((assignedNode) => {
                    if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                        slotContent += _serializeElement(assignedNode as Element)
                    } else if (assignedNode.nodeType === Node.TEXT_NODE) {
                        slotContent += (assignedNode as Text).textContent || ''
                    }
                })
                html += `<slot>${slotContent}</slot>`
            } else if (el.tagName !== 'SLOT') {
                // Skip <slot> elements when there's no shadow context
                html += _serializeElementWithSlot(el, slotContext)
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            html += (node as Text).textContent || ''
        }
    })
    return html
}

function _serializeElementWithSlot(el: Element, slotContext?: ShadowRoot): string {
    const shadowRoot = (el as any).shadowRoot as ShadowRoot | null
    if (shadowRoot) return _serializeElement(el)
    const tag = el.tagName.toLowerCase()
    let attrs = ''
    for (let i = 0; i < el.attributes.length; i++) {
        const a = el.attributes[i]
        attrs += ` ${a.name}="${a.value}"`
    }
    return `<${tag}${attrs}>${_serializeChildren(el, slotContext)}</${tag}>`
}

// Custom useInterval that runs 4 times then stops to prevent spam
export const useInterval = (callback, delay) => {
    let count = 0
    const id = setInterval(() => {
        callback()
        count++

        if (count > 4)
            clearInterval(id)
    }, delay)

    // const count = $(0)
    // const maxCount = 4 // Run 4 times then stop

    // useEffect(() => {
    //     if (count() >= maxCount) return

    //     let intervalId

    //     const tick = () => {
    //         callback()
    //         count(count() + 1)

    //         // Stop after reaching max count
    //         if (count() >= maxCount) {
    //             if (intervalId) {
    //                 clearInterval(intervalId)
    //             }
    //         }
    //     }

    //     if (delay && count() < maxCount) {
    //         intervalId = setInterval(tick, delay)
    //     }

    //     // Cleanup function
    //     return () => {
    //         if (intervalId) {
    //             clearInterval(intervalId)
    //         }
    //     }
    // })
}

// Custom useTimeout that runs once with limit support
export const useTimeout = (callback, delay) => {
    if (!delay) return

    const timeoutId = setTimeout(() => {
        callback()
    }, delay)

    // Return a cleanup function to clear the timeout if needed
    return () => clearTimeout(timeoutId)
}

let staticIndex = 0

export const TestSnapshots = ({ Component, props }: { Component: (JSX.Component | Constructor<any>) & { test: { static?: boolean, enable?: () => boolean, wrap?: boolean, snapshots?: string[], compareActualValues?: boolean, expect?: () => string }, name?: string }, props?: Record<any, any> }): JSX.Element => {
    const ref = $<HTMLDivElement>()
    const index = staticIndex++
    let htmlPrev = ''
    let ticks = 0
    let done = false
    const getHTML = (): string => {
        const element = ref()
        if (!element) return ''
        return minimiseHtml(getInnerHTML(element))
    }
    const tick = (): void => {
        if (done) return
        const indexPrev = index
        ticks += 1

        // Use microtask to ensure DOM is updated before assertion
        queueMicrotask(() => {

            // New format: component uses compareActualValues without snapshots, or has an expect function
            const actualHTMLForNewFormat = getHTML()
            const actualSnapshot = actualHTMLForNewFormat ? actualHTMLForNewFormat.replace(/<h3>[^<]*<\/h3>/, '') : ''

            if (!Component.test.enable || Component.test.enable())
                // If the component has an expect function (like our new format), use that for comparison
                if (Component.test.expect && typeof Component.test.expect === 'function') {
                    // The expect function is being executed - this is the key verification
                    const expectedValue = Component.test.expect()

                    // Normalize expected value to array for uniform handling
                    const expectedValues = Array.isArray(expectedValue) ? expectedValue : [expectedValue]

                    // For static components, verify exact match
                    if (Component.test.static) {
                        // For static tests, DO NOT convert actual values to placeholders
                        // Compare actual literal values directly with expected values
                        const actualForComparison = actualSnapshot

                        // Check if actual matches any of the expected values
                        const matches = expectedValues.some(expected => actualForComparison === expected)

                        if (matches) {
                            //temp hide for assertion only
                            console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                        } else {
                            assert(false, `[${Component.name}]: Expected actual \n'${actualForComparison}' to match one of the expected values \n'${JSON.stringify(expectedValues)}'`)
                        }
                    } else {
                        // For dynamic components with compareActualValues, use the expect function result directly
                        // without placeholder conversion
                        if (Component.test.compareActualValues) {
                            const matches = expectedValues.some(expected => actualSnapshot === expected)

                            if (matches) {
                                //temp hide for assertion only
                                console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                            } else {
                                assert(false, `[${Component.name}]: Expected '${actualSnapshot}' to match one of the expected values '${JSON.stringify(expectedValues)}'`)
                            }
                        } else {
                            // For dynamic components with registered observables, compare actual values directly
                            // Components must use registerTestObservable and return concrete values in expect function
                            const nonEmptyExpected = expectedValues.filter(expected => expected && expected.trim() !== '')

                            if (nonEmptyExpected.length > 0) {
                                const matches = nonEmptyExpected.some(expected => actualSnapshot === expected)

                                if (matches) {
                                    // temp hide for assertion only
                                    console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                                } else {
                                    assert(false, `[${Component.name}]: Expected actual '${actualSnapshot}' to match one of the expected values '${JSON.stringify(nonEmptyExpected)}'`)
                                }
                            } else {
                                assert(false, `[${Component.name}]: Expect function returned empty result: '${JSON.stringify(expectedValues)}'`)
                            }
                        }
                    }
                } else if (Component.test.compareActualValues) {
                    // For compareActualValues without expect function, do basic validation
                    assert(actualSnapshot.includes('<p>') && actualSnapshot.includes('<\/p>'), `[${Component.name}]: Expected to render a paragraph element`)
                }

            htmlPrev = actualHTMLForNewFormat
        }) // Close queueMicrotask
    }
    const noUpdate = (): void => {
        assert(false, `[${Component.name}]: Expected no updates to ever happen`)
    }
    const yesUpdate = (): void => {
        if (Component.test.static) return
        if (ticks > 1) return
        assert(false, `[${Component.name}]: Expected at least one update`)
    }
    useEffect(() => {
        const root = ref()
        if (!root) return
        tick()
        const timeoutId = setTimeout(yesUpdate, 1500)
        const onMutation = Component.test.static ? noUpdate : () => {
            console.log(`[util.tsx] Mutation detected for ${Component.name}`)
            // Call tick immediately to see if this works
            tick()
        }
        // Check if MutationObserver exists (browser environment)
        let observer: MutationObserver | null = null
        if (typeof MutationObserver !== 'undefined' && root instanceof Node) {
            observer = new MutationObserver(onMutation)
            const options = { attributes: true, childList: true, characterData: true, subtree: true }
            observer.observe(root, options)
        }
        return () => {
            clearTimeout(timeoutId)
            if (observer) {
                observer.disconnect()
            }
        }
    })
    return (
        <div>
            <span><b>Test #{index}</b></span>
            <div ref={ref}>
                <Component {...props} />
            </div>
        </div>
    )
}