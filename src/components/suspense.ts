

import { useEnvironment } from '../components/environment_context'
import { SuspenseContext } from '../components/suspense.context'
import { useMemo } from '../hooks/soby'
import { useSuspense } from '../hooks/soby'
import { resolve } from '../methods/soby'
import { $$ } from '../methods/soby'
import { suspense as _suspense, ternary } from '../soby'
import type { Child, FunctionMaybe, ObservableReadonly } from '../types'

const SYMBOL_CLONE = Symbol.for('CloneElement')


export const Suspense = ({ when, fallback, children }: { when?: FunctionMaybe<unknown>, fallback?: Child, children?: Child }): ObservableReadonly<Child> | Child => {
  const isSSR = useEnvironment() === 'ssr'

  return SuspenseContext.wrap(suspense => {

    const condition = useMemo(() => !!$$(when) || suspense.active())

    const stack = new Error()

    let childrenSuspended
    if (isSSR) {
      // Recursively resolve to handle nested observables and JSX functions in arrays
      const deepResolve = (value: any): any => {
        const resolved = resolve(value)
        // If it's a JSX function (has Observable symbols but is actually callable), invoke it
        if (typeof resolved === 'function') {
          const symbols = Object.getOwnPropertySymbols(resolved)
          // Check if it's a wrapped JSX element function (has Observable symbols but should be invoked)
          const hasObservableSymbol = symbols.some(
            sym => sym.description && sym.description.includes('Observable')
          )
          if (hasObservableSymbol) {
            try {
              const invoked = resolved()
              console.log('deepResolve')
              return deepResolve(invoked)
            } catch (e) {
              console.error('[Suspense] SSR: invocation failed', e)
              return resolved
            }
          }
        }
        if (Array.isArray(resolved)) {
          return resolved.map(item => deepResolve(item))
        }
        return resolved
      }
      childrenSuspended = deepResolve(children)
    } else {
      childrenSuspended = useSuspense(condition, () => resolve(children), stack)
    }

    const result = ternary(condition, fallback, childrenSuspended)

    return result

  })

}