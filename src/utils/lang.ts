/* IMPORT */

import { SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_TEMPLATE_ACCESSOR, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import type { ComponentFunction, Falsy, TemplateActionProxy, Truthy } from '../types'
import { isObservable } from 'soby'

/* MAIN */

export const assign = Object.assign

export const castArray = <T>(value: T[] | T): T[] => {

  return isArray(value) ? value : [value]

}

export const castError = (exception: unknown): Error => {

  if (isError(exception)) return exception

  if (isString(exception)) return new Error(exception)

  return new Error('Unknown error')

}

export const flatten = <T>(arr: T[]) => {

  for (let i = 0, l = arr.length; i < l; i++) {

    if (!isArray(arr[i])) continue

    return arr.flat(Infinity)

  }

  return arr

}

export const indexOf = (() => {

  const _indexOf = Array.prototype.indexOf

  return <T>(arr: ArrayLike<unknown>, value: T): number => {

    return _indexOf.call(arr, value)

  }

})()

// export const { isArray } = Array
export const isArray = <T>(a: any): a is Array<T> => a instanceof Array

export const isBoolean = (value: unknown): value is boolean => {

  return typeof value === 'boolean'

}

export const isComponent = (value: unknown): value is ComponentFunction => {

  return isFunction(value) && (SYMBOL_UNTRACKED_UNWRAPPED in value)

}

export const isError = (value: unknown): value is Error => {

  return value instanceof Error

}

export const isFalsy = <T>(value: T): value is Falsy<T> => {

  return !value

}

export const isFunction = (value: unknown): value is ((...args: any[]) => any) => {

  return typeof value === 'function'

}

export const isClass = <T,>(fn: T): boolean => {
  return typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn))
}

export const isFunctionReactive = (value: Function): boolean => {

  return !(SYMBOL_UNTRACKED in value || SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || value[SYMBOL_OBSERVABLE_READABLE]?.parent?.disposed)

}

export const isNil = (value: unknown): value is null | undefined => {

  return value === null || value === undefined

}

export const isNode = (value: unknown): value is Node => {

  return value instanceof Node

}

export const isObject = (value: unknown): value is object => {

  return typeof value === 'object' && value !== null

}

export const isPrimitive = (value: unknown): value is string | number | boolean | symbol | null | undefined | bigint => {
  const t = typeof value
  return !(t === 'object' || t === 'function')
}

export const isPromise = (value: unknown): value is Promise<unknown> => {

  return value instanceof Promise

}

export const isString = (value: unknown): value is string => {

  return typeof value === 'string'

}


export const isSVG = (value: Element | Comment): value is SVGElement => {
  return !!value['isSVG']

}

export const isSVGElement = (() => {

  const svgRe = /^(t(ext$|s)|s[vwy]|g)|^set|tad|ker|p(at|s)|s(to|c$|ca|k)|r(ec|cl)|ew|us|f($|e|s)|cu|n[ei]|l[ty]|[GOP]/ //URL: https://regex101.com/r/Ck4kFp/1
  const svgCache = {}

  return (element: string): boolean => {

    const cached = svgCache[element]

    return (cached !== undefined) ? cached : (svgCache[element] = !element.includes('-') && svgRe.test(element))

  }

})()

export const isTemplateAccessor = (value: unknown): value is TemplateActionProxy => {

  return isFunction(value) && (SYMBOL_TEMPLATE_ACCESSOR in value)

}

export const isTruthy = <T>(value: T): value is Truthy<T> => {

  return !!value

}

export const isVoidChild = (value: unknown): value is null | undefined | symbol | boolean => {

  return value === null || value === undefined || typeof value === 'boolean' || typeof value === 'symbol'

}

export const noop = (): void => {

  return

}

export const once = <T>(fn: () => T): (() => T) => {

  let called = false
  let result: T

  return (): T => {

    if (!called) {

      called = true
      result = fn()

    }

    return result

  }

}

export const isProxy = (proxy): proxy is typeof Proxy => {
  return proxy == null ? false : !!proxy[Symbol.for("__isProxy")]
}

export const fixBigInt = (v: any | bigint) => typeof v === 'bigint' ? v + 'n' : v

/**
 * Checks if a value is a pure function (not an observable)
 * 
 * This utility function determines whether a given value is a plain function
 * that is not wrapped as an observable. This is useful for distinguishing
 * between reactive and non-reactive functions in the Woby framework.
 * 
 * @param fn - The value to check
 * @returns True if the value is a pure function, false otherwise
 * 
 * @example
 * ```typescript
 * isPureFunction(() => {}) // returns true
 * isPureFunction($(console.log)) // returns false
 * isPureFunction('not a function') // returns false
 * ```
 */
export const isPureFunction = (fn: Function) => typeof fn === 'function' && !isObservable(fn)

export const toArray = <T,>(v: T | T[]) => [...[v].flat(Infinity)] as T[]
