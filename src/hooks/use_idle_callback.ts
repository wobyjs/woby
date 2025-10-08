

import { useScheduler } from '../hooks/use_scheduler'
import { $$ } from '../methods/soby'
import type { Disposer, FunctionMaybe, ObservableMaybe } from '../types'


export const useIdleCallback = (callback: ObservableMaybe<IdleRequestCallback>, options?: FunctionMaybe<IdleRequestOptions>): Disposer => {

  const stack = new Error()

  return useScheduler({
    callback,
    once: true,
    cancel: cancelIdleCallback,
    schedule: callback => requestIdleCallback(callback, $$(options)),
    stack
  })

}
