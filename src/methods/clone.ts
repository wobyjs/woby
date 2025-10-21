import { isArray, isFunction, isObject, isPrimitive } from '../utils'
import { $, $$, isObservable } from './soby'

// import { $, $$, isObservable, isFunction, isArray } from ".."

// const isPrimitive = (value: unknown): value is string | number | boolean | symbol | null | undefined | bigint => {
// 	const t = typeof value
// 	return !(t === "object" || t === "function")
// }

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
export const clone = <T,>(source: T, deepClone = false): T => {
	if (isPrimitive(source))
		return source

	if (isFunction(source))
		return source

	if (isArray(source))
		if (deepClone)
			return source.map(item => clone(item, deepClone)) as any
		else
			return source

	//is object
	const newObject = {}

	Object.keys(source).forEach((key) => {
		if (typeof source[key] === "function" && !isObservable(source[key])) {
			newObject[key] = source[key]
		}
		else if (isObservable(source[key]) && isObject($$(source[key])) && !isArray($$(source[key]))) {
			const innerObject = clone($$(source[key]))
			newObject[key] = innerObject
		}
		else if (isObservable(source[key])) {
			newObject[key] = $($$(source[key]))
		}

		else if (isObject($$(source[key])) && deepClone) {
			const innerObject = clone(source[key])
			newObject[key] = innerObject
		} else
			newObject[key] = source[key]
	})

	return newObject as T
}