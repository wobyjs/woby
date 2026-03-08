

import { isObservable } from '../methods/soby'
import { useGuarded } from '../hooks/use_guarded'
import { useUntracked } from '../hooks/soby'
import { resolve, ternary } from '../soby'
import { isComponent, isFunction, isTruthy } from '../utils/lang'
import type { Child, FunctionMaybe, ObservableReadonly, Truthy } from '../types'
import { useEnvironment } from '../components/environment_context'


//TODO: Support an is/guard prop, maybe

export const If = <T>({ when, fallback, children }: { when: FunctionMaybe<T>, fallback?: Child, children: Child | ((value: (() => Truthy<T>)) => Child) }): ObservableReadonly<Child> => {
  const isSSR = useEnvironment() === 'ssr'

  if (isSSR) {
    // In SSR mode, don't use useGuarded as it throws errors for falsy values
    // Evaluate when value and handle accordingly
    const whenValue = isFunction(when) ? when() : when

    if (isFunction(children) && !isObservable(children as any) && !isComponent(children)) {
      // For SSR with function children, call the function directly without guard
      if (!whenValue) {
        // When falsy, resolve and return fallback or empty string
        // Don't use ternary - just return the resolved fallback directly
        return resolve(fallback ?? '') as any
      }
      // When truthy, call children function with value accessor
      return (children as Function)(() => whenValue)
    } else {
      // Direct children - use ternary
      return ternary(when, children as Child, fallback) as any
    }
  }

  if (isFunction(children) && !isObservable(children as any) && !isComponent(children)) { // Calling the children function with an (() => Truthy<T>)
    const truthy = useGuarded(when, isTruthy)

    const result = ternary(when, useUntracked(() => (children as Function)(truthy)), fallback)
    return result

  } else { // Just passing the children along

    const result = ternary(when, children as Child, fallback) //TSC
    return result

  }

}
