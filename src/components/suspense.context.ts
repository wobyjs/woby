
/* IMPORT */

import { SYMBOL_SUSPENSE, SYMBOL_SUSPENSE_COLLECTOR } from '../constants'
import { useCleanup } from '../hooks/soby'
import { useMemo } from '../hooks/soby'
import { $ } from '../methods/soby'
import { context, resolve } from '../soby'
import type { SuspenseCollectorData, SuspenseData } from '../types'

/* MAIN */

export const SuspenseContext = {

  create: (): SuspenseData => {

    const count = $(0)
    const active = useMemo(() => !!count())
    const increment = (nr: number = 1) => count(prev => prev + nr)
    const decrement = (nr: number = -1) => queueMicrotask(() => count(prev => prev + nr))
    const data = { active, increment, decrement }

    const collector = context<SuspenseCollectorData>(SYMBOL_SUSPENSE_COLLECTOR)

    if (collector) {

      collector?.register(data)

      useCleanup(() => collector.unregister(data))

    }

    return data

  },

  get: (): SuspenseData | undefined => {

    return context<SuspenseData>(SYMBOL_SUSPENSE)

  },

  wrap: <T>(fn: (data: SuspenseData) => T) => {

    const data = SuspenseContext.create()

    return context({ [SYMBOL_SUSPENSE]: data }, () => {

      return resolve(() => fn(data))

    })

  }

}