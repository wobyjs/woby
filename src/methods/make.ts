import { Observant } from "../types"
import { $ } from "./soby"

/**
 * Make every properties Observable
 * 
 * This function takes an object and converts all of its properties to observables.
 * Functions are left unchanged to preserve their behavior.
 * 
 * @template T - The type of the input object
 * @param obj - The object to convert
 * @param inplace - Whether to modify the original object (true) or create a new one (false, default)
 * @returns An object with the same keys as the input, but with all non-function values converted to observables
 * 
 * @example
 * ```typescript
 * const obj = { name: 'John', age: 30, greet() { return `Hello, ${this.name}` } }
 * const observableObj = make(obj)
 * // observableObj.name() returns 'John'
 * // observableObj.age() returns 30
 * // observableObj.greet() still works as a function
 * ```
 */
export const make = <T,>(obj: T, inplace = false): Observant<T> => {
    const o = inplace ? obj : { ...obj }
    Object.keys(o).forEach((k) => (o[k] = typeof o[k] !== "function" ? $(o[k]) : o[k]))
    return o as any
}
