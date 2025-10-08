

import { useAbortController } from '../hooks/use_abort_controller'
import type { ArrayMaybe } from '../types'


export const useAbortSignal = (signals: ArrayMaybe<AbortSignal> = []): AbortSignal => {

  return useAbortController(signals).signal

}
