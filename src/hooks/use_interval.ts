
/* IMPORT */

import useScheduler from '../hooks/use_scheduler'
import $$ from '../methods/SS'
import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types'

/* MAIN */

const useInterval = (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>): Disposer => {

  const stack = new Error()

  return useScheduler({
    callback,
    cancel: clearInterval,
    schedule: callback => setInterval(callback, $$(ms)),
    stack
  })

}

/* EXPORT */

export default useInterval