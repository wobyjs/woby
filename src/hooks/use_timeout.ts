

import { useScheduler } from '../hooks/use_scheduler'
import { $$ } from '../methods/soby'
import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types'
import { Stack } from '../soby'


export const useTimeout = (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>): Disposer => {

  const stack = new Stack()

  return useScheduler({
    callback: (/* ignored */) => {
      const cbAny = $$(callback) as unknown
      const cb = typeof cbAny === 'function' ? (cbAny as Callback) : undefined
      cb?.({ stack })
    },
    once: true,
    cancel: clearTimeout,
    schedule: callback => setTimeout(callback, $$(ms)),
    stack
  })

}
