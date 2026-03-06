

import { isObservable } from '../methods/soby'
import { useGuarded } from '../hooks/use_guarded'
import { useUntracked } from '../hooks/soby'
import { ternary } from '../soby'
import { isComponent, isFunction, isTruthy } from '../utils/lang'
import type { Child, FunctionMaybe, ObservableReadonly, Truthy } from '../types'
import { useEnvironment } from '../components/environment_context'


//TODO: Support an is/guard prop, maybe

export const If = <T>({ when, fallback, children }: { when: FunctionMaybe<T>, fallback?: Child, children: Child | ((value: (() => Truthy<T>)) => Child) }): ObservableReadonly<Child> => {
  const isSSR = useEnvironment() === 'ssr'

  if (isSSR)
    isFunction(when) && when() //resolve/cache the value

  if (isFunction(children) && !isObservable(children as any) && !isComponent(children)) { // Calling the children function with an (() => Truthy<T>)

    const truthy = useGuarded(when, isTruthy)

    const result = ternary(when, useUntracked(() => (children as Function)(truthy)), fallback)
    return result

  } else { // Just passing the children along

    const result = ternary(when, children as Child, fallback) //TSC
    return result

  }

}
