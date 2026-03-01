/* IMPORT */

import * as Woby from 'woby'
import type { JSX, Observable } from 'woby'
import { useEffect } from 'woby'
import { $, } from 'woby'

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

// Custom useInterval that runs 4 times then stops to prevent spam
export const useInterval = (callback, delay) => {
    let count =0
    const id = setInterval(()=>{
        callback()
        count++

if(count>4)
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
        return element.innerHTML
    }
    const getSnapshot = (html: string, isStatic: boolean, componentName: string): string => {
        const htmlWithoutTitle = html.replace(/<h3>[^<]*<\/h3>/, '')
        // For deterministic tests, don't convert random values to placeholders
        // Only convert BigInt values for specific test cases
        let htmlWitRandomBigint = htmlWithoutTitle


        // Handle empty placeholders for removal tests
        // But preserve actual empty parentheses for NullRemoval and UndefinedRemoval tests
        if (!(componentName === 'TestNullRemoval' || componentName === 'TestUndefinedRemoval')) {
            // Convert empty parentheses with whitespace to empty placeholder for other tests
            htmlWitRandomBigint = htmlWitRandomBigint.replace(/\(\s*\)/g, '(<!---->)')
        }

        const htmlWithRandomHex = htmlWitRandomBigint.replace(/#[a-fA-F0-9]+\{random-bigint\}/g, '{random-color}').replace(/#[a-fA-F0-9]{6,8}/g, '{random-color}')
        return htmlWithRandomHex
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

                    // For static components, verify exact match
                    if (Component.test.static) {
                        // For static tests, DO NOT convert actual values to placeholders
                        // Compare actual literal values directly with expected values
                        const actualForComparison = actualSnapshot

                        // console.log('STATIC TEST - Actual (before conversion):', JSON.stringify(actualForComparison))
                        // console.log('STATIC TEST - Expected (before conversion):', JSON.stringify(expectedValue))
                        // console.log('STATIC TEST - Actual (after conversion):', JSON.stringify(actualForComparison))
                        // console.log('STATIC TEST - Expected (unchanged):', JSON.stringify(expectedValue))
                        // console.log('STATIC TEST - Equal:', actualForComparison === expectedValue)
                        if (actualForComparison === expectedValue) {
                            //temp hide for assertion only
                            console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                        } else {
                            assert(false, `[${Component.name}]: Expected actual '${actualForComparison}' to be equal to function result '${expectedValue}'`)
                        }
                    } else {
                        // For dynamic components with compareActualValues, use the expect function result directly
                        // without placeholder conversion
                        if (Component.test.compareActualValues) {
                            if (actualSnapshot === expectedValue) {
                                //temp hide for assertion only
                                console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                            } else {
                                assert(false, `[${Component.name}]: Expected '${actualSnapshot}' to match function result '${expectedValue}'`)
                            }
                        } else {
                            // For other dynamic components, we need to convert both actual and expected to the same format
                            // using the same placeholder logic as getSnapshot()
                            // console.log(`${Component.name} expect function executed, returned: ${expectedValue}`)
                            // console.log('DYNAMIC TEST - Actual (before conversion):', JSON.stringify(actualSnapshot))
                            // console.log('DYNAMIC TEST - Expected (before conversion):', JSON.stringify(expectedValue))

                            // For dynamic components with registered observables, compare actual values directly
                            // Components must use registerTestObservable and return concrete values in expect function
                            if (expectedValue && expectedValue.trim() !== '') {
                                if (actualSnapshot === expectedValue) {
                                    // temp hide for assertion only
                                    console.log(`✅ Expect function test passed for ${Component.name}`, ' expect: ', actualSnapshot)
                                } else {
                                    assert(false, `[${Component.name}]: Expected actual '${actualSnapshot}' to match expected '${expectedValue}'`)
                                }
                            } else {
                                assert(false, `[${Component.name}]: Expect function returned empty result: '${expectedValue}'`)
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
        const observer = new MutationObserver(onMutation)
        const options = { attributes: true, childList: true, characterData: true, subtree: true }
        observer.observe(root, options)
        return () => observer.disconnect()
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