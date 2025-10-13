import { Observant } from "../types"
import { $, isObservable } from "./soby"

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
export const make = <T,>(obj: T, options: { inplace?: boolean, convertFunction?: boolean } = { inplace: false, convertFunction: false }): Observant<T> => {
    const { inplace = false, convertFunction = false } = options
    const o = inplace ? obj : { ...obj }
    Object.keys(o).forEach((k) => {
        // If already an observable, ignore
        if (isObservable(o[k])) return

        // If a function and convertFunction is false, ignore
        if (typeof o[k] === "function" && !convertFunction) return

        // If object/primitive or function (when convertFunction is true), make it observable
        if (convertFunction || typeof o[k] !== "function") {
            o[k] = $(o[k])
        }
    })
    return o as any
}