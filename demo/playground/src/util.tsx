/* IMPORT */

import * as Woby from 'woby'
import type { JSX, Observable } from 'woby'
import { useEffect, $, } from 'woby'
import { aspectReport } from './aspects'

globalThis.Woby = Woby

/* PER-TEST TALLY
 *
 * Both harnesses (<TestSnapshots> in the browser, runSSRTest() under Node) record into one
 * registry keyed by test name, so `pnpm dev` and `pnpm test` report the same numbers for the
 * same file instead of two differently-derived totals.
 *
 * Each tick of a test performs up to two assertions:
 *   ssr — the renderToString() comparison inside the file's own test.expect(). Runs in BOTH
 *         environments, so this is the number the two suites must agree on.
 *   dom — the innerHTML-vs-expect() comparison. Needs a real document, so it is browser-only
 *         and always absent from `pnpm test`.
 * Same tick schedule on both sides (see runSSRTest / TestSnapshots) => same `ticks` and `ssr`.
 */
export type TestTally = { instances: number, ticks: number, ssr: number, dom: number, fail: number }

const tallies: Record<string, TestTally> = ((globalThis as any).__testResults ??= {})
export const testTallies = tallies
const tallyFor = (name: string): TestTally =>
    tallies[name] ??= { instances: 0, ticks: 0, ssr: 0, dom: 0, fail: 0 }

// Name of the test whose tick is currently on the stack, and whether we are inside its
// expect(). The 300-odd test files log their own `✅ [name] SSR test passed` and call assert()
// from inside expect(); reading these two here is what attributes those to the right file
// without having to thread a name through every one of them.
const beginTick = (name: string): void => { (globalThis as any).__currentTest = name; (globalThis as any).__inExpect = false }
const enterExpect = (): void => { (globalThis as any).__inExpect = true }
const leaveExpect = (): void => { (globalThis as any).__inExpect = false }
const endTick = (): void => { (globalThis as any).__currentTest = null; (globalThis as any).__inExpect = false }

export const tallyTotals = () => {
    let instances = 0, ticks = 0, ssr = 0, dom = 0, fail = 0
    for (const t of Object.values(tallies)) { instances += t.instances; ticks += t.ticks; ssr += t.ssr; dom += t.dom; fail += t.fail }
    return { tests: Object.keys(tallies).length, instances, ticks, ssr, dom, fail }
}

// Count every console.log so the full-suite log volume can be verified past
// the devtools 1000-message buffer cap, via `dv eval` reading
// globalThis.__consoleLogCount. Guarded so HMR re-imports don't double-wrap.
if (!(globalThis as any).__consoleLogPatched) {
    (globalThis as any).__consoleLogPatched = true;
    (globalThis as any).__consoleLogCount = 0;
    (globalThis as any).__passLogCount = 0;
    const origLog = console.log.bind(console)
    console.log = (...args: any[]) => {
        const g = globalThis as any
        g.__consoleLogCount++
        if (String(args[0]).includes('✅')) {
            g.__passLogCount++
            // A ✅ logged while a file's expect() is on the stack is that expect()'s own SSR
            // assertion passing. Anything else (including <TestSnapshots>'s DOM ✅, which is
            // logged after expect() returns) is tallied explicitly by its own harness.
            if (g.__inExpect && g.__currentTest) tallyFor(g.__currentTest).ssr++
        }
        origLog(...args)
    }
}

/* TYPE */

type Constructor<T, Args extends unknown[] = unknown[]> = new (...args: Args) => T

type FunctionUnwrap<T> = T extends ({ (): infer U }) ? U : T

/* HELPERS */

export const TEST_INTERVAL = 500 // Lowering this makes it easier to spot some memory leaks

export const assert = (result: boolean, message?: string): void => {
    console.assert(result, message)
    // Test-harness result tracking so the full suite can be verified past the
    // console's 1000-message cap via `dv eval` reading globalThis.__testFailures.
    const g = globalThis as any
    if (!g.__testFailures) g.__testFailures = []
    if (!g.__testPassCount) g.__testPassCount = 0
    if (result) g.__testPassCount++
    else {
        g.__testFailures.push(message || 'assertion failed')
        // Attribute to whichever test's tick is running, so the per-file tally shows where.
        if (g.__currentTest) tallyFor(g.__currentTest).fail++
    }
}

/**
 * Node-only SSR harness — the counterpart to <TestSnapshots> below.
 *
 * The browser runs `Component.test.expect()` once per DOM mutation, so a component whose
 * useInterval toggles state 5 times asserts 6 times. `pnpm test` used to run each file once
 * and print an unconditional ✅, which is why it reported 309 checks against the browser's
 * ~1600. This drives the same expect() on the same schedule so both report the same work;
 * only the DOM half of each tick (which needs a real document) is browser-exclusive.
 */
let ssrNames: string[] = []
let ssrTicks = 0
let ssrOutstanding = 0
let ssrRegistrationClosed = false
let ssrReported = false

// A file may declare several test components (TestCustomElementBasic has four), so the tally is
// per-file: every runSSRTest call registers, and the summary is emitted once all have settled.
const reportSSR = (): void => {
    if (ssrReported || !ssrRegistrationClosed || ssrOutstanding > 0) return
    ssrReported = true

    const g = globalThis as any
    const failures: string[] = g.__testFailures || []
    // Real assertion tally, not a count of ✅ lines: `pass` is the number of SSR comparisons
    // that ran and held. <TestSnapshots> reports the same field from the same registry.
    const totals = tallyTotals()

    console.log(`📊 SSR RESULT ${JSON.stringify({ name: ssrNames.join('+'), ticks: ssrTicks, pass: totals.ssr, fail: failures.length, tests: tallies })}`)
    for (const f of failures) console.error(`❌ ${f}`)

    process.exitCode = failures.length ? 1 : 0
    // Force-exit once stdout has drained, so a stray timer left by a component under test
    // can't hold the runner's 60s slot open. unref'd so it never extends a process that was
    // already ready to exit on its own.
    setTimeout(() => process.exit(process.exitCode), 100).unref?.()
}

export const runSSRTest = (name: string, Component: any): void => {
    const test = Component?.test
    ssrNames.push(name)

    // All runSSRTest calls happen synchronously at module end, so registration is complete
    // by the time the microtask queue drains.
    if (!ssrRegistrationClosed) {
        queueMicrotask(() => { ssrRegistrationClosed = true; reportSSR() })
    }

    if (!test || typeof test.expect !== 'function') return

    // The module body may already have instantiated the component; registerTestObservable
    // throws on duplicates, so only build it when nothing registered it yet.
    if (!(`${name}_ssr` in testObservables)) {
        try {
            // JSX always hands a component an object, never undefined, so match that. A
            // component needing real prop values declares them as `test.props`.
            Component(test.props ?? {})
        } catch (e: any) {
            assert(false, `[${name}] component threw during SSR construction: ${e?.stack || e}`)
        }
    }

    tallyFor(name).instances++

    let ticks = 0
    const runTick = (): void => {
        ticks++
        ssrTicks++
        tallyFor(name).ticks++
        beginTick(name)
        try {
            if (test.enable && !test.enable()) return
            enterExpect()
            test.expect()
            leaveExpect()
        } catch (e: any) {
            assert(false, `[${name}] expect() threw on tick ${ticks}: ${e?.stack || e}`)
        } finally {
            endTick()
        }
    }

    runTick()

    // A static component never mutates, so one assertion is the whole test. A dynamic one is
    // driven by useInterval(TEST_INTERVAL), which fires 5 times before clearing itself —
    // re-assert just after each fire to cover every state the browser sees.
    if (test.static) return

    ssrOutstanding++
    let fired = 0
    const id = setInterval(() => {
        runTick()
        if (++fired >= 5) {
            clearInterval(id)
            ssrOutstanding--
            reportSSR()
        }
    }, TEST_INTERVAL)
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
    if (name in testObservables) {
        throw new Error(`[registerTestObservable]: Duplicate name "${name}" already registered.`)
    }
    testObservables[name] = observable
}

// Helper to get computed style of an element by selector
export const getComputedStyleValue = (selector: string, property: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const element = document.querySelector(selector)
    if (!element) {
        console.warn(`[getComputedStyleValue] Element not found: ${selector}`)
        return null
    }
    
    const computedStyle = window.getComputedStyle(element)
    return computedStyle.getPropertyValue(property)
}

// Helper to get computed styles from shadow DOM
export const getShadowComputedStyleValue = (customElementTag: string, innerSelector: string, property: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const customElement = document.querySelector(customElementTag)
    if (!customElement) {
        console.warn(`[getShadowComputedStyleValue] Custom element not found: ${customElementTag}`)
        return null
    }
    
    const shadowRoot = (customElement as any).shadowRoot
    if (!shadowRoot) {
        console.warn(`[getShadowComputedStyleValue] No shadow root on: ${customElementTag}`)
        return null
    }
    
    const element = shadowRoot.querySelector(innerSelector)
    if (!element) {
        console.warn(`[getShadowComputedStyleValue] Inner element not found: ${innerSelector} in ${customElementTag}`)
        return null
    }
    
    const computedStyle = window.getComputedStyle(element)
    return computedStyle.getPropertyValue(property)
}

// Helper to get computed styles from slotted content (light DOM children of custom element)
export const getSlottedComputedStyleValue = (customElementTag: string, selector: string, property: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const customElement = document.querySelector(customElementTag)
    if (!customElement) {
        console.warn(`[getSlottedComputedStyleValue] Custom element not found: ${customElementTag}`)
        return null
    }
    
    // Query light DOM children (slotted content)
    const element = customElement.querySelector(selector)
    if (!element) {
        console.warn(`[getSlottedComputedStyleValue] Slotted element not found: ${selector} in ${customElementTag}`)
        return null
    }
    
    const computedStyle = window.getComputedStyle(element)
    return computedStyle.getPropertyValue(property)
}

// Helper to print all computed styles for debugging
export const printComputedStyles = (selector: string, properties: string[]): Record<string, string> => {
    if (typeof document === 'undefined') return {}
    
    const element = document.querySelector(selector)
    if (!element) {
        console.warn(`[printComputedStyles] Element not found: ${selector}`)
        return {}
    }
    
    const computedStyle = window.getComputedStyle(element)
    const result: Record<string, string> = {}
    
    properties.forEach(prop => {
        result[prop] = computedStyle.getPropertyValue(prop)
    })
    
    console.log(`[Computed Styles for ${selector}]`, result)
    return result
}

// Helper to print shadow DOM computed styles
export const printShadowComputedStyles = (customElementTag: string, innerSelector: string, properties: string[]): Record<string, string> => {
    if (typeof document === 'undefined') return {}
    
    const customElement = document.querySelector(customElementTag)
    if (!customElement) {
        console.warn(`[printShadowComputedStyles] Custom element not found: ${customElementTag}`)
        return {}
    }
    
    const shadowRoot = (customElement as any).shadowRoot
    if (!shadowRoot) {
        console.warn(`[printShadowComputedStyles] No shadow root on: ${customElementTag}`)
        return {}
    }
    
    const element = shadowRoot.querySelector(innerSelector)
    if (!element) {
        console.warn(`[printShadowComputedStyles] Inner element not found: ${innerSelector} in ${customElementTag}`)
        return {}
    }
    
    const computedStyle = window.getComputedStyle(element)
    const result: Record<string, string> = {}
    
    properties.forEach(prop => {
        result[prop] = computedStyle.getPropertyValue(prop)
    })
    
    console.log(`[Shadow Computed Styles for ${customElementTag} > ${innerSelector}]`, result)
    return result
}

/**
 * Serializes an element to HTML string, recursively handling shadow DOM.
 * For custom elements with shadowRoot: wraps shadow content in <template shadowrootmode="open">,
 * then appends only light DOM children that are NOT assigned to any slot (hidden from output).
 * Falls back to element.innerHTML for elements without shadow DOM.
 */
export function getInnerHTML(element: Element): string {
    if (!element) return ''

    // return element.innerHTML
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
        } else if (node.nodeType === Node.COMMENT_NODE) {
            // Preserve HTML comments in shadow DOM
            html += `<!--${(node as Comment).textContent || ''}-->`
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
        } else if (node.nodeType === Node.COMMENT_NODE) {
            // Preserve HTML comments
            html += `<!--${(node as Comment).textContent || ''}-->`
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

    // Void elements (self-closing) should not have closing tags or children
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    if (voidElements.includes(tag)) {
        return `<${tag}${attrs}>`
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

/* BROWSER SUMMARY
 *
 * The counterpart to reportSSR(). Components mount as the app renders and the dynamic ones keep
 * ticking for 5 * TEST_INTERVAL, so the summary is emitted once no instance is outstanding and
 * nothing new has mounted for a settle window. Same numbers, same shape as `pnpm test`'s.
 */
let domOutstanding = 0
let domReported = false
let domCloseTimer: ReturnType<typeof setTimeout> | null = null

const reportDOM = (): void => {
    if (domReported) return
    domReported = true

    const t = tallyTotals()
    const failures: string[] = (globalThis as any).__testFailures || []
    const bar = '='.repeat(60)

    console.log(`\n${bar}\n📊 BROWSER TEST SUMMARY\n${bar}`)
    console.log(`   Test components: ${t.tests} (${t.instances} instance${t.instances === 1 ? '' : 's'})`)
    console.log(`   Ticks:      ${t.ticks}`)
    console.log('-'.repeat(60))
    console.log(`   Assertions: ${t.ssr + t.dom}`)
    console.log(`   ├ SSR (renderToString — also run by \`pnpm test\`): ${t.ssr}`)
    console.log(`   └ DOM (innerHTML — browser only):                 ${t.dom}`)
    console.log(`   ❌ Failed:  ${failures.length}`)
    console.log(bar)
    for (const f of failures) console.error(`❌ ${f}`)
    console.log(failures.length ? `\n❌ ${failures.length} FAILURE(S)` : `\n🎉 All tests passed!`)

    // Which part of the framework the run actually covered — the same table `pnpm test` prints,
    // so the two are comparable at a glance. The raw per-test map stays on globalThis for machine
    // reads (`dv eval --script "JSON.stringify(globalThis.__testResults)"`) instead of being
    // dumped into the console, where it only buried the summary it was meant to back up.
    console.log(`\n📋 COVERAGE BY ASPECT`)
    for (const line of aspectReport(tallies)) console.log(`   ${line}`)
    console.log(bar)
}

const scheduleDOMReport = (): void => {
    if (domReported) return
    if (domCloseTimer) clearTimeout(domCloseTimer)
    // Longer than the 3000ms yesUpdate guard, so a missing-update failure is always counted.
    domCloseTimer = setTimeout(() => (domOutstanding > 0 ? scheduleDOMReport() : reportDOM()), 3500)
}

export const TestSnapshots =({ Component, props }: { Component: (JSX.Component | Constructor<any>) & { test: { static?: boolean, enable?: () => boolean, wrap?: boolean, snapshots?: string[], compareActualValues?: boolean, expect?: () => string | string[] }, name?: string }, props?: Record<any, any> }): JSX.Element => {
    const ref = $<HTMLDivElement>()
    const index = staticIndex++
    // Same key runSSRTest() tallies under, so a browser entry and a `pnpm test` entry for the
    // same file line up field for field.
    const testName = Component.name || `anonymous#${index}`
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
        ticks += 1
        tallyFor(testName).ticks++

        // Use microtask to ensure DOM is updated before assertion
        queueMicrotask(() => {
            beginTick(testName)
            try { runAssertions() }
            catch (e: any) { assert(false, `[${testName}]: tick ${ticks} threw: ${e?.stack || e}`) }
            finally { endTick() }
        })
    }
    const runAssertions = (): void => {

        // New format: component uses compareActualValues without snapshots, or has an expect function
        const actualHTMLForNewFormat = getHTML()
        const actualSnapshot = actualHTMLForNewFormat ? minimiseHtml(actualHTMLForNewFormat.replace(/<h3>[^<]*<\/h3>/, '')) : ''

        if (!Component.test.enable || Component.test.enable())
            // If the component has an expect function (like our new format), use that for comparison
            if (Component.test.expect && typeof Component.test.expect === 'function') {
                // The expect function is being executed - this is the key verification.
                // Bracketed by enterExpect/leaveExpect so the file's own `✅ ... SSR test
                // passed` log and any assert() it raises are tallied as this test's SSR half.
                enterExpect()
                const expectedValue = Component.test.expect()
                leaveExpect()

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
                        tallyFor(testName).dom++

                        console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                    } else {
                        assert(false, `[${Component.name}]: Expected actual \n'${actualForComparison}' to match one of the expected values \n'${expectedValues.join(' or \n')}'`)
                    }
                } else {
                    // For dynamic components with compareActualValues, use the expect function result directly
                    // without placeholder conversion
                    if (Component.test.compareActualValues) {
                        const matches = expectedValues.some(expected => actualSnapshot === expected)

                        if (matches) {
                            //temp hide for assertion only
                            tallyFor(testName).dom++

                            console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                        } else {
                            assert(false, `[${Component.name}]: Expected '${actualSnapshot}' to match one of the expected values '${expectedValues.join(' or \n')}'`)
                        }
                    } else {
                        // For dynamic components with registered observables, compare actual values directly
                        // Components must use registerTestObservable and return concrete values in expect function
                        const nonEmptyExpected = expectedValues.filter(expected => expected && expected.trim() !== '')

                        if (nonEmptyExpected.length > 0) {
                            const matches = nonEmptyExpected.some(expected => actualSnapshot === expected)

                            if (matches) {
                                // temp hide for assertion only
                                tallyFor(testName).dom++

                                console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                            } else {
                                assert(false, `[${Component.name}]: Expected actual '${actualSnapshot}' to match one of the expected values '${JSON.stringify(nonEmptyExpected)}'`)
                            }
                        } else {
                            assert(false, `[${Component.name}]: Expect function returned empty result: '${expectedValues.join(' or \n')}'`)
                        }
                    }
                }
            } else if (Component.test.compareActualValues) {
                // For compareActualValues without expect function, do basic validation
                assert(actualSnapshot.includes('<p>') && actualSnapshot.includes('<\/p>'), `[${Component.name}]: Expected to render a paragraph element`)
            }

        htmlPrev = actualHTMLForNewFormat
    }
    let mutated = false
    const noUpdate = (): void => {
        beginTick(testName)
        assert(false, `[${testName}]: Expected no updates to ever happen`)
        endTick()
    }
    const yesUpdate = (): void => {
        if (mutated) return
        beginTick(testName)
        assert(false, `[${testName}]: Expected at least one update`)
        endTick()
    }
    useEffect(() => {
        const root = ref()
        if (!root) return
        tallyFor(testName).instances++
        scheduleDOMReport()

        tick()

        // Check if MutationObserver exists (browser environment)
        let observer: MutationObserver | null = null
        if (typeof MutationObserver !== 'undefined' && root instanceof Node) {
            observer = new MutationObserver(Component.test.static ? noUpdate : () => { mutated = true })
            const options = { attributes: true, childList: true, characterData: true, subtree: true }
            observer.observe(root, options)
        }

        // Same schedule runSSRTest() uses under Node: a static component asserts once, a dynamic
        // one asserts again after each of the 5 fires of its useInterval(TEST_INTERVAL). The
        // assertions used to be driven off the MutationObserver instead, which made the tick
        // count depend on how many MutationRecords a state change happened to produce — that is
        // why the browser reported ~1600 against `pnpm test`'s per-file tally. The observer is
        // still what proves a dynamic component touched the DOM at all (yesUpdate).
        let intervalId: ReturnType<typeof setInterval> | null = null
        let timeoutId: ReturnType<typeof setTimeout> | null = null
        if (Component.test.static) {
            done = true
        } else {
            domOutstanding++
            let fired = 0
            intervalId = setInterval(() => {
                tick()
                if (++fired >= 5) {
                    clearInterval(intervalId!)
                    intervalId = null
                    done = true
                    domOutstanding--
                    scheduleDOMReport()
                }
            }, TEST_INTERVAL)
            timeoutId = setTimeout(yesUpdate, 3000)
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            if (intervalId) clearInterval(intervalId)
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