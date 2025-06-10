
/* IMPORT */

import { SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import isObservable from '../methods/is_observable'
import useRenderEffect from '../hooks/use_render_effect'
import $$ from '../methods/SS'
import { createText } from '../utils/creators.ssr'
import { isArray, isFunction, isString } from '../utils/lang'
import type { Classes, ObservableMaybe, Styles } from '../types'
import { SYMBOL_OBSERVABLE_WRITABLE } from 'oby'

/* MAIN */

const resolveChild = <T>(value: ObservableMaybe<T>, setter: ((value: T | T[], dynamic: boolean, stack: Error) => void), _dynamic: boolean = false, stack: Error): void => {

  if (isFunction(value)) {

    if (SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || value[SYMBOL_OBSERVABLE_READABLE]?.parent?.disposed) {

      if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
        (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

      resolveChild(value(), setter, _dynamic, stack)

    } else {

      useRenderEffect((stack) => {

        if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
          (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

        resolveChild(value(), setter, true, stack)

      }, stack)

    }

  } else if (isArray(value)) {

    const [values, hasObservables] = resolveArraysAndStatics(value)

    values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED] // Preserving this special symbol

    setter(values, hasObservables || _dynamic, stack)

  } else {

    setter(value, _dynamic, stack)

  }

}

const resolveClass = (classes: Classes, resolved: Record<string, true> = {}): Record<string, true> => {

  if (isString(classes)) {

    classes.split(/\s+/g).filter(Boolean).filter(cls => {

      resolved[cls] = true

    })

  } else if (isFunction(classes)) {

    resolveClass(classes(), resolved)

  } else if (isArray(classes)) {

    classes.forEach(cls => {

      resolveClass(cls as Classes, resolved) //TSC

    })

  } else if (classes) {

    for (const key in classes) {

      const value = classes[key]
      const isActive = !!$$(value)

      if (!isActive) continue

      resolved[key] = true

    }

  }

  return resolved

}

const resolveStyle = (styles: Styles, resolved: Record<string, null | undefined | number | string> | string = {}): Record<string, null | undefined | number | string> | string => {

  if (isString(styles)) { //TODO: split into the individual styles, to be able to merge them with other styles

    return styles

  } else if (isFunction(styles)) {

    return resolveStyle(styles(), resolved)

  } else if (isArray(styles)) {

    styles.forEach(style => {

      resolveStyle(style as Styles, resolved) //TSC

    })

  } else if (styles) {

    for (const key in styles) {

      const value = styles[key]

      resolved[key] = $$(value)

    }

  }

  return resolved

}

const resolveArraysAndStatics = (() => {

  // This function does 3 things:
  // 1. It deeply flattens the array, only if actually needed though (!)
  // 2. It resolves statics, it's important to resolve them soon enough or they will be re-created multiple times (!)
  // 3. It checks if we found any Observables along the way, avoiding looping over the array another time in the future

  const DUMMY_RESOLVED = []

  const resolveArraysAndStaticsInner = (values: any[], resolved: any[], hasObservables: boolean): [any[], boolean] => {

    for (let i = 0, l = values.length; i < l; i++) {

      const value = values[i]
      const type = typeof value

      if (type === 'string' || type === 'number' || type === 'bigint') { // Static

        if (resolved === DUMMY_RESOLVED) resolved = values.slice(0, i)

        resolved.push(createText(value))

      } else if (type === 'object' && isArray(value)) { // Array

        if (resolved === DUMMY_RESOLVED) resolved = values.slice(0, i)

        hasObservables = resolveArraysAndStaticsInner(value, resolved, hasObservables)[1]

      } else if (type === 'function' && isObservable(value)) { // Observable

        if (resolved !== DUMMY_RESOLVED) resolved.push(value)

        hasObservables = true

      } else { // Something else

        if (resolved !== DUMMY_RESOLVED) resolved.push(value)

      }

    }

    if (resolved === DUMMY_RESOLVED) resolved = values

    return [resolved, hasObservables]

  }

  return (values: any[]): [any[], boolean] => {

    return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false)

  }

})()

/* EXPORT */

export { resolveChild, resolveClass, resolveArraysAndStatics, resolveStyle }