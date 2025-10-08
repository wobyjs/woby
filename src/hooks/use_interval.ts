

import { useScheduler } from '../hooks/use_scheduler'
import { $$ } from '../methods/soby'
import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types'


export const useInterval = (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>): Disposer => {

  const stack = new Error()

  return useScheduler({
    callback,
    cancel: clearInterval,
    schedule: callback => setInterval(callback, $$(ms)),
    stack
  })

}
