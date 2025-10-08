

import { useEffect } from '../hooks/soby'
import type { Disposer, EffectFunction, EffectOptions } from '../types'
import { Stack } from '../soby'

/* HELPERS */

const options: EffectOptions = {
  sync: 'init',
  stack: undefined
}


// This function exists for convenience, and to avoid creating unnecessary options objects

export const useRenderEffect = (fn: EffectFunction, stack: Stack): Disposer => {

  return useEffect(fn, { ...options, stack })

}
