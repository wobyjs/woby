import type { Observant } from '../types';
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
    copyByRef?: boolean;
    /** Copy methods:
     * @property all - assign all properties.
     * @property new - assign only new properties that exist in source but not in target.
     * @property old - assign only properties that exist in target but not in source.
     * @property empty - assign properties where target[key] is undefined, null, '', 0, NaN, or []
     */
    condition?: 'new' | 'old' | 'all' | 'empty';
    /** If false, convert target[key] to observable
     *  If true, keep target[key] as non observable
     *
     * @default false
     */
    keepTargetNoObservable?: boolean;
    /**
     * Track source[key] by using useEffect if isObserable(source[key])
     * @default false
     */
    track?: boolean;
    /**
     * Array of keys that should be merged rather than replaced.
     * When specified, these keys will have their values merged using the mv() function
     * which combines strings or objects rather than completely replacing them.
     *
     * @default [] - no keys are merged by default
     */
    merge?: Array<keyof T>;
    /**
     * If true, copy options from source[key][SYMBOL_OBSERVABLE_WRITABLE].options
     * to target[key] when both are observables.
     *
     * @default false
     */
    copyOptions?: boolean;
};
/**
 * Copy by value or reference, depending on the option.
 * This function provides advanced object merging capabilities with support for:
 * - Observable-aware assignment
 * - Function preservation (functions are never converted to observables)
 * - Deep copying vs reference copying
 * - Conditional assignment (new, old, all, empty)
 * - Tracking source observables for automatic updates
 * - Merging specific keys rather than replacing them
 * - Copying observable options from source to target
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
 *
 * // Copy observable options
 * const target7 = { a: $(1, { equals: (a, b) => a === b }) }
 * const source7 = { a: $(2, { equals: (a, b) => Object.is(a, b) }) }
 * assign(target7, source7, { copyOptions: true })
 * // Copies the equals function from source7.a to target7.a
 * ```
 */
export declare const assign: <T, S, O extends AssignOptions<T>>(target: T, source: S, options?: O) => O["condition"] extends "old" ? (O["keepTargetNoObservable"] extends true ? T : Observant<T>) : (O["keepTargetNoObservable"] extends true ? T & S : Observant<T & S>);
//# sourceMappingURL=assign.d.ts.map