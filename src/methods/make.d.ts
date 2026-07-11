import { Observant } from "../types";
/**
 * Make every properties Observable
 *
 * This function takes an object and converts all of its properties to observables.
 * Functions are left unchanged to preserve their behavior.
 *
 * @template T - The type of the input object
 * @param obj - The object to convert
 * @param options - Configuration options
 * @param options.inplace - Whether to modify the original object (true) or create a new one (false, default)
 * @param options.convertFunction - Whether to convert functions to observables (false, default)
 * @returns An object with the same keys as the input, but with all non-function values converted to observables
 *
 * @example
 * ```typescript
 * const obj = { name: 'John', age: 30, greet() { return `Hello, ${this.name}` } }
 * const observableObj = make(obj, { inplace: false, convertFunction: false })
 * // observableObj.name() returns 'John'
 * // observableObj.age() returns 30
 * // observableObj.greet() still works as a function
 * ```
 */
export declare const make: <T>(obj: T, options?: {
    inplace?: boolean;
    convertFunction?: boolean;
}) => Observant<T>;
//# sourceMappingURL=make.d.ts.map