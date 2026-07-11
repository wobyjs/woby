/**
 * Creates a shallow or deep clone of an object.
 * Preserves observable properties by creating new observables with the same values.
 *
 * @param source d The object to clone
 * @param deepClone d If true, performs deep cloning of nested objects
 * @returns A cloned copy of the source object
 *
 * @example
 * ```tsx
 * const original = { name: 'John', age: 30, active: $(true) }
 * const shallowClone = clone(original)
 * const deepClone = clone(original, true)
 * ```
 */
export declare const clone: <T>(source: T, deepClone?: boolean) => T;
//# sourceMappingURL=clone.d.ts.map