

import { SuspenseContext } from '../components/suspense.context'
import { useMemo } from '../hooks/soby'
import { useSuspense } from '../hooks/soby'
import { resolve } from '../methods/soby'
import { $$ } from '../methods/soby'
import { suspense as _suspense, ternary } from '../soby'
import type { Child, FunctionMaybe, ObservableReadonly } from '../types'


export const Suspense = ({ when, fallback, children }: { when?: FunctionMaybe<unknown>, fallback?: Child, children?: Child }): ObservableReadonly<Child> => {

  return SuspenseContext.wrap(suspense => {

    const condition = useMemo(() => !!$$(when) || suspense.active())

    const stack = new Error()
    const childrenSuspended =
      useSuspense(condition, () => resolve(children), stack)

    return ternary(condition, fallback, childrenSuspended)

  })

}