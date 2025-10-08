
import { $, $$, isObservable } from './soby'
import { useEffect } from '../hooks/soby'
import type { Observant } from '../types'
import { isFunction } from '../utils'

/**
 * Options for the assignObject function
 */
export type AssignOptions<T = unknown> = {
    /**
     * If true, assign by reference.
     * If false, perform a deep assign by value.
     * 
     * @default true - assign by ref
     */
    copyByRef?: boolean,

    /** Copy methods:
     * @property all - assign all properties.
     * @property new - assign only new properties that exist in source but not in target.
     * @property old - assign only properties that exist in target but not in source.
     * @property empty - assign properties where target[key] is undefined, null, '', 0, NaN, or []
     */
    condition?: 'new' | 'old' | 'all' | 'empty',

    /** If false, convert target[key] to observable
     *  If true, keep target[key] as non observable
     * 
     * @default false
     */
    keepTargetNoObservable?: boolean,

    /**
     * Track source[key] by using useEffect if isObserable(source[key])
     * @default false
     */
    track?: boolean,

    /**
     * Array of keys that should be merged rather than replaced.
     * When specified, these keys will have their values merged using the mv() function
     * which combines strings or objects rather than completely replacing them.
     * 
     * @default [] - no keys are merged by default
     */
    merge?: Array<keyof T>
}

/**
 * Merge two values, combining strings or objects.
 * For strings, concatenates with a space and trims.
 * For objects, merges properties.
 * For other types, returns the source value.
 * 
 * @param target - The target value
 * @param source - The source value
 * @returns The merged value
 */
function mv<T>(target: T, source: T): T {
    const targetValue = target
    const sourceValue = source

    if (typeof targetValue === 'string' && typeof sourceValue === 'string')
        return `${targetValue} ${sourceValue}`.trim() as any
    else if (typeof targetValue === 'object' && typeof sourceValue === 'object')
        return { ...targetValue, ...sourceValue } as any

    return source // Return the modified target for further chaining if necessary
}

/**
 * Set the value of a target observable from a source value.
 * If merge is true, uses the merge function to combine values.
 * 
 * @param target - The target observable
 * @param source - The source value
 * @param merge - Whether to merge values
 */
const set = <T,>(target: T, source: T, merge: boolean) => {
    if (merge)
        // Merge values if key is in mergeKeys
        (target as any)(mv($$(target), $$(source))) // Use mergeValues properly
    else
        (target as any)($$(source))
}

/**
 * Check if a value is a plain object.
 * 
 * @param obj - The object to check
 * @returns True if the value is a plain object
 */
const isObject = (obj: {}) => {
    if (obj == undefined) return false
    if (obj.constructor.name == "Object") {
        return true
    }
    else {
        return false
    }
}

/**
 * Copy by value or reference, depending on the option.
 * This function provides advanced object merging capabilities with support for:
 * - Observable-aware assignment
 * - Function preservation (functions are never converted to observables)
 * - Deep copying vs reference copying
 * - Conditional assignment (new, old, all, empty)
 * - Tracking source observables for automatic updates
 * - Merging specific keys rather than replacing them
 * 
 * Functions are treated specially in this function:
 * - Functions are never converted to observables, regardless of options
 * - Functions are assigned by reference directly
 * - This behavior ensures that callback functions and methods work correctly
 * 
 * @template T - The type of the target object
 * @template S - The type of the source object
 * @template O - The type of the options object
 * 
 * @param target - The target object to assign to
 * @param source - The source object to assign from
 * @param options - Options for the assignment
 * 
 * @returns The modified target object
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const target = { a: 1, b: $(2) }
 * const source = { b: 3, c: 4 }
 * assign(target, source)
 * // Result: { a: 1, b: 3, c: 4 } where b is now an observable
 * 
 * // Function handling - functions are never converted to observables
 * const target1 = { onClick: () => console.log('target') }
 * const source1 = { onClick: () => console.log('source'), onHover: () => console.log('hover') }
 * assign(target1, source1)
 * // Result: { onClick: () => console.log('source'), onHover: () => console.log('hover') }
 * // Note: onClick is directly assigned as a function, not converted to an observable
 * 
 * // Copy by reference (default)
 * const target2 = { a: $(1) }
 * const source2 = { a: 2 }
 * assign(target2, source2)
 * // target2.a is updated to 2, but it's still the same observable
 * 
 * // Copy by value
 * const target3 = { a: $(1) }
 * const source3 = { a: 2 }
 * assign(target3, source3, { copyByRef: false })
 * // target3.a is replaced with a new observable containing 2
 * 
 * // Conditional assignment
 * const target4 = { a: 1, b: 2 }
 * const source4 = { b: 3, c: 4 }
 * assign(target4, source4, { condition: 'new' })
 * // Only assigns new properties: { a: 1, b: 2, c: 4 }
 * 
 * // Merge specific keys
 * const target5 = { style: 'red', class: 'btn' }
 * const source5 = { style: 'bold', id: 'button' }
 * assign(target5, source5, { merge: ['style'] })
 * // Merges style property: { style: 'red bold', class: 'btn', id: 'button' }
 * 
 * // Track source observables
 * const target6 = { a: $(1) }
 * const source6 = { a: $(2) }
 * assign(target6, source6, { track: true })
 * // Automatically updates target6.a when source6.a changes
 * ```
 */
export const assign = <T, S, O extends AssignOptions<T>>(target: T, source: S, options?: O):
    O['condition'] extends 'old'
    ? (O['keepTargetNoObservable'] extends true ? T : Observant<T>)
    : (O['keepTargetNoObservable'] extends true ? T & S : Observant<T & S>) => {

    if (!source) return target as any

    const { condition: method = 'all', copyByRef = true, keepTargetNoObservable = false, track = false, merge = [] } = options ?? {}
    const m = merge.reduce((acc, item) => (acc[item] = true, acc), {} as Record<keyof T, true>)

    // Get the keys based on the selected method
    const keys = (() => {
        switch (method) {
            case 'new':
                return Object.keys(source).filter(key => !(key in (target as any)))
            case 'old':
                return Object.keys(target).filter(key => key in (source as any))
            case 'empty':
                return Object.keys(source).filter(key => {
                    const targetValue = target[key]
                    const sourceValue = source[key]
                    const isTargetEmpty = (
                        targetValue === undefined ||
                        targetValue === null ||
                        targetValue === 0 ||
                        isNaN(targetValue) ||
                        targetValue === '' ||
                        (Array.isArray(targetValue) && targetValue.length === 0)
                    )
                    const isSourceNonEmpty = !(
                        sourceValue === undefined ||
                        sourceValue === null ||
                        sourceValue === 0 ||
                        isNaN(sourceValue) ||
                        sourceValue === '' ||
                        (Array.isArray(sourceValue) && sourceValue.length === 0)
                    )
                    return isTargetEmpty && isSourceNonEmpty
                })
            default:
                return Object.keys(source)
        }
    })() as any

    keys.forEach((key) => {
        if (copyByRef) {
            // Shallow copy by reference
            if (isObservable(target[key])) {
                // Update observable by reference
                set(target[key], source[key], m[key])

                if (track && isObservable(source[key]))
                    useEffect(() => set(target[key], source[key], m[key]))
            } else {
                // Direct reference assignment/override
                const temp = $$(target[key])
                target[key] = isObservable(source[key]) || isFunction(source[key]) ? source[key] : $(source[key])

                if (m[key as keyof T])
                    (target[key] as any)(mv(temp, $$(source[key])))
            }
        } else {
            // Deep copy by value, non primitive
            if (typeof $$(source[key]) === "object" && isObject($$(source[key]))) {
                if (isObservable(target[key])) {
                    if (typeof $$(target[key]) === 'object')
                        // Deep copy for observable objects recursively, object to object assignment
                        assign<T, S, O>($$(target[key]) as T, $$(source[key]), options) //this is merging, string checked
                    else //target is empty, copy an cloned object
                    {
                        //target is primitive, then make an object
                        (target[key] as any)(assign<T, S, O>({} as T, $$(source[key]), options))
                        if (track && isObservable(source[key]))
                            useEffect(() => { (target[key] as any)(assign<T, S, O>({} as T, $$(source[key]), options)) })
                    }
                } else {
                    // Assign or initialize nondobservable nested objects
                    const temp = target[key]
                    target[key] = keepTargetNoObservable
                        ? assign(m[key] ? temp : {}, $$(source[key]), options as any)
                        : $(assign(m[key] ? temp : {}, $$(source[key]), options as any))

                    if (track && isObservable(target[key]) && isObservable(source[key]))
                        useEffect(() => { (target[key] as any)(assign(m[key] ? temp : {}, $$(source[key]), options as any)) })
                }
            } else { //primitive
                if (isObservable(target[key])) {
                    set(target[key], source[key], m[key])

                    const temp = $$(target[key])

                    if (track && isObservable(source[key]))
                        useEffect(() => (target[key] as any)(m[key] ? mv(temp, $$(source[key])) : $$(source[key])))
                }
                else {
                    const temp = target[key]

                    target[key] = keepTargetNoObservable ? source[key] :
                        (target[key] = isObservable(source[key]) || isFunction(source[key]) ? source[key] : $(source[key]))

                    if (m[key as keyof T])
                        (target[key] as any)(mv(temp, $$(source[key])))

                    if (track && isObservable(target[key]) && isObservable(source[key]))
                        if (target[key] !== source[key])
                            useEffect(() => (target[key] as any)(m[key] ? mv(temp, $$(source[key])) : $$(source[key])))
                }
            }
        }
    })

    return target as any
}
