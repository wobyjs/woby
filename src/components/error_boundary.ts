
/* IMPORT */

import untrack from '../methods/untrack'
import { tryCatch } from 'oby'
import { isFunction } from '../utils/lang'
import type { Callback, Child, FN, ObservableReadonly } from '../types'

/* MAIN */

const ErrorBoundary = ({ fallback, children }: { fallback: Child | FN<[{ error: Error, reset: Callback }], Child>, children: Child }): ObservableReadonly<Child> => {

  return tryCatch(children, props => {
    const error = props.error instanceof Error ? props.error : new Error(String(props.error ?? 'Unknown error'))
    const newProps = { error, reset: props.reset }
    return untrack(() => isFunction(fallback) ? fallback(newProps) : fallback)
  })

}

/* EXPORT */

export default ErrorBoundary
