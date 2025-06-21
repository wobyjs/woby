
/* IMPORT */

import useCheapDisposed from '../hooks/use_cheap_disposed'
import { with as _with, Stack } from '../soby'
import type { Callback } from '../types'

/* MAIN */

//TODO: Maybe port this to soby
//TODO: Maybe special-case this to use one shared mirotask per microtask

const useMicrotask = (fn: Callback, stack: Stack): void => {

  const disposed = useCheapDisposed()
  const runWithOwner = _with()

  queueMicrotask(() => {

    if (disposed()) return

    runWithOwner(fn, stack)

  })

}

/* EXPORT */

export default useMicrotask