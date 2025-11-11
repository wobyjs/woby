import { SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import { isObservable } from '../methods/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { $$ } from '../methods/soby'
import { createText } from '../utils/creators.ssr'
import { isArray, isFunction, isString } from '../utils/lang'
import type { Classes, ObservableMaybe, Styles } from '../types'
import { SYMBOL_OBSERVABLE_WRITABLE } from 'soby'
import { SYMBOL_CLONE } from '../constants'
import { Stack } from '../soby'


export const resolveChild = <T>(value: ObservableMaybe<T>, setter: ((value: T | T[], dynamic: boolean, stack: Stack) => void), _dynamic: boolean = false, stack: Stack): void => {

  if (isArray(value)) {
    // console.log('resolveChild: handling array', value)
    // console.log('resolveChild: array length', value.length)

    const [values, hasObservables] = resolveArraysAndStatics(value)

    // console.log('resolveChild: resolved array values', values)
    // console.log('resolveChild: hasObservables', hasObservables)
    // console.log('resolveChild: values length', values.length)

    values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED] // Preserving this special symbol

    setter(values, hasObservables || _dynamic, stack)

  }
  else if (isFunction(value)) {
    // console.log('resolveChild: handling function', value)
    // console.log('resolveChild: function has SYMBOL_UNTRACKED_UNWRAPPED:', SYMBOL_UNTRACKED_UNWRAPPED in value)
    // console.log('resolveChild: function has SYMBOL_CLONE:', SYMBOL_CLONE in value)

    if (SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || value[SYMBOL_OBSERVABLE_READABLE]?.parent?.disposed) {

      if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
        (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

      const resolvedValue = value()
      // console.log('resolveChild: resolved function to', resolvedValue)
      resolveChild(resolvedValue, setter, _dynamic, stack)

    } else {

      useRenderEffect((stack) => {

        if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
          (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

        const resolvedValue = value()
        // console.log('resolveChild: resolved function in render effect to', resolvedValue)
        resolveChild(resolvedValue, setter, true, stack)

      }, stack)

    }
  }
  else {
    // console.log('resolveChild: handling value', value)
    setter(value, _dynamic, stack)

  }

}

export const resolveClass = (classes: Classes, resolved: Record<string, true> = {}): Record<string, true> => {

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

export const resolveStyle = (styles: Styles, resolved: Record<string, null | undefined | number | string> | string = {}): Record<string, null | undefined | number | string> | string => {

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

export const resolveArraysAndStatics = (() => {

  // This function does 3 things:
  // 1. It deeply flattens the array, only if actually needed though (!)
  // 2. It resolves statics, it's important to resolve them soon enough or they will be re-created multiple times (!)
  // 3. It checks if we found any Observables along the way, avoiding looping over the array another time in the future

  const DUMMY_RESOLVED = []

  const resolveArraysAndStaticsInner = (values: any[], resolved: any[], hasObservables: boolean): [any[], boolean] => {
    // console.log('resolveArraysAndStaticsInner: processing values', values)
    // console.log('resolveArraysAndStaticsInner: values length', values.length)

    for (let i = 0, l = values.length; i < l; i++) {

      const value = values[i]
      const type = typeof value
      // console.log('resolveArraysAndStaticsInner: processing value', value, 'type', type)

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

    // console.log('resolveArraysAndStaticsInner: returning resolved', resolved, 'hasObservables', hasObservables)
    return [resolved, hasObservables]

  }

  return (values: any[]): [any[], boolean] => {
    // console.log('resolveArraysAndStatics: called with values', values)
    return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false)

  }

})()