

import { useEffect } from '../hooks/soby'
import { useSuspended } from '../hooks/soby'
import { $$ } from '../methods/soby'
import { untrack } from '../methods/soby'
import type { Disposer, FN, FunctionMaybe, ObservableMaybe } from '../types'
import { Stack } from '../soby'


export const useScheduler = <T, U>({ loop, once, callback, cancel, schedule, stack }: { loop?: FunctionMaybe<boolean>, once?: boolean, callback: ObservableMaybe<FN<[U]>>, cancel: FN<[T]>, schedule: ((callback: FN<[U]>) => T), stack: Stack }): Disposer => {

  let executed = false
  let suspended = useSuspended(stack)
  let tickId: T

  const work = (value: U): void => {

    executed = true

    if ($$(loop)) tick()

    $$(callback, false)(value)

  }

  const tick = (): void => {

    tickId = untrack(() => schedule(work))

  }

  const dispose = (): void => {

    untrack(() => cancel(tickId))

  }

  useEffect(() => {

    if (once && executed) return

    if (suspended()) return

    tick()

    return dispose

  }, { suspense: false, stack: stack })

  return dispose

}