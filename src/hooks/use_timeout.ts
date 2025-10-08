

import { useScheduler } from '../hooks/use_scheduler'
import { $$ } from '../methods/soby'
import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types'


export const useTimeout = (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>): Disposer => {

  const stack = new Error()

  return useScheduler({
    callback,
    once: true,
    cancel: clearTimeout,
    schedule: callback => setTimeout(callback, $$(ms)),
    stack
  })

}
