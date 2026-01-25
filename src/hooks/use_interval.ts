

import { useScheduler } from '../hooks/use_scheduler'
import { $$ } from '../methods/soby'
import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types'
import { Stack } from '../soby'


export const useInterval = (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>): Disposer => {

  const stack = new Stack()

  return useScheduler({
    callback: (/* ignored */) => {
      const cbAny = $$(callback) as unknown
      const cb = typeof cbAny === 'function' ? (cbAny as Callback) : undefined
      cb?.({ stack })
    },
    cancel: clearInterval,
    schedule: callback => setInterval(callback, $$(ms)),
    stack
  })

}
