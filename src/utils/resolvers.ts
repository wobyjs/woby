import { SYMBOL_OBSERVABLE_READABLE, SYMBOL_UNCACHED, SYMBOL_OBSERVABLE_WRITABLE } from '../constants'
import { isObservable, untrack } from '../methods/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { $$ } from '../methods/soby'
import { createText as createTextDOM } from '../utils/creators'
import { createText as createTextSSR } from '../ssr/document'
import { isArray, isFunction, isFunctionReactive, isString } from '../utils/lang'
import type { Classes, ObservableMaybe, Styles } from '../types'
import { Observable, Stack } from '../soby'
import { useEnvironment, EnvironmentContext, showEnvLog } from '../components/environment_context'
import { context } from '../soby'

// const replaceSelf = <T extends { [SYMBOL_DOM]: HTMLElement | HTMLElement[] } & Observable<HTMLElement>>(value: T, newNode: HTMLElement | HTMLElement[]) => {
//   const node = value[SYMBOL_DOM]
//   if (!node)
//     return false

//   const isList = newNode instanceof NodeList

//   if (node instanceof NodeList || isArray(node)) {
//     const ns = [...(node as any)].flat()
//     ns.forEach((n, i) => i !== 0 && n.remove())
//     ns[0].replaceWith(...(value[SYMBOL_DOM] = (isList ? [...newNode as any] : [newNode]).flat()))
//   }
//   else
//     node.replaceWith(...(value[SYMBOL_DOM] = (isList ? [...newNode as any] : [newNode]).flat()))

//   return true
// }

export const resolveChild = <T>(value: ObservableMaybe<T>, setter: ((value: T | T[], dynamic: boolean, stack: Stack) => void), _dynamic: boolean = false, stack: Stack): void => {
  const env = useEnvironment()
  const isSSR = env === 'ssr'

  if (isArray(value)) {

    const [values, hasObservables] = resolveArraysAndStatics(value)

    values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED] // Preserving this special symbol

    setter(values, hasObservables || _dynamic, stack)
  }
  else if (isFunction(value)) {

    if (!isFunctionReactive(value) || isSSR) { //SSR one time only

      if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
        (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

      const newValue = value()

      resolveChild(newValue, setter, _dynamic, stack)

    } else {

      useRenderEffect((stack) => {

        if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
          (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

        const newValue = $$(value)
        resolveChild(newValue, setter, true, stack)

      }, stack)

    }

  } else {

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
    const isSSR = useEnvironment() === 'ssr'

    const createText = isSSR ? createTextSSR : createTextDOM

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
