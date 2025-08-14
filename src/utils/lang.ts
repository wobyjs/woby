
/* IMPORT */

import { SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_TEMPLATE_ACCESSOR, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import type { ComponentFunction, Falsy, TemplateActionProxy, Truthy } from '../types'

/* MAIN */

const { assign } = Object

const castArray = <T>(value: T[] | T): T[] => {

  return isArray(value) ? value : [value]

}

const castError = (exception: unknown): Error => {

  if (isError(exception)) return exception

  if (isString(exception)) return new Error(exception)

  return new Error('Unknown error')

}

const flatten = <T>(arr: T[]) => {

  for (let i = 0, l = arr.length; i < l; i++) {

    if (!isArray(arr[i])) continue

    return arr.flat(Infinity)

  }

  return arr

}

const indexOf = (() => {

  const _indexOf = Array.prototype.indexOf

  return <T>(arr: ArrayLike<unknown>, value: T): number => {

    return _indexOf.call(arr, value)

  }

})()

const { isArray } = Array

const isBoolean = (value: unknown): value is boolean => {

  return typeof value === 'boolean'

}

const isComponent = (value: unknown): value is ComponentFunction => {

  return isFunction(value) && (SYMBOL_UNTRACKED_UNWRAPPED in value)

}

const isError = (value: unknown): value is Error => {

  return value instanceof Error

}

const isFalsy = <T>(value: T): value is Falsy<T> => {

  return !value

}

const isFunction = (value: unknown): value is ((...args: any[]) => any) => {

  return typeof value === 'function'

}

const isClass = <T,>(fn: T): boolean => {
  return typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn))
}

const isFunctionReactive = (value: Function): boolean => {

  return !(SYMBOL_UNTRACKED in value || SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || value[SYMBOL_OBSERVABLE_READABLE]?.parent?.disposed)

}

const isNil = (value: unknown): value is null | undefined => {

  return value === null || value === undefined

}

const isNode = (value: unknown): value is Node => {

  return value instanceof Node

}

const isObject = (value: unknown): value is object => {

  return typeof value === 'object' && value !== null

}

const isPrimitive = (value: unknown): value is string | number | boolean | symbol | null | undefined | bigint => {
  const t = typeof value
  return !(t === 'object' || t === 'function')
}

const isPromise = (value: unknown): value is Promise<unknown> => {

  return value instanceof Promise

}

const isString = (value: unknown): value is string => {

  return typeof value === 'string'

}

const isSVG = (value: Element): value is SVGElement => {

  return !!value['isSVG']

}

const isSVGElement = (() => {

  const svgRe = /^(t(ext$|s)|s[vwy]|g)|^set|tad|ker|p(at|s)|s(to|c$|ca|k)|r(ec|cl)|ew|us|f($|e|s)|cu|n[ei]|l[ty]|[GOP]/ //URL: https://regex101.com/r/Ck4kFp/1
  const svgCache = {}

  return (element: string): boolean => {

    const cached = svgCache[element]

    return (cached !== undefined) ? cached : (svgCache[element] = !element.includes('-') && svgRe.test(element))

  }

})()

const isTemplateAccessor = (value: unknown): value is TemplateActionProxy => {

  return isFunction(value) && (SYMBOL_TEMPLATE_ACCESSOR in value)

}

const isTruthy = <T>(value: T): value is Truthy<T> => {

  return !!value

}

const isVoidChild = (value: unknown): value is null | undefined | symbol | boolean => {

  return value === null || value === undefined || typeof value === 'boolean' || typeof value === 'symbol'

}

const noop = (): void => {

  return

}

const once = <T>(fn: () => T): (() => T) => {

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

export const toArray = <T,>(v: T | T[]) => [...[v].flat(Infinity)] as T[]

/* EXPORT */

export { assign, castArray, castError, flatten, indexOf, isArray, isBoolean, isComponent, isError, isFalsy, isFunction, isClass, isFunctionReactive, isNil, isNode, isObject, isPrimitive, isPromise, isString, isSVG, isSVGElement, isTemplateAccessor, isTruthy, isVoidChild, noop, once }