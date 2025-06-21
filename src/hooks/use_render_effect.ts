
/* IMPORT */

import useEffect from '../hooks/use_effect'
import type { Disposer, EffectFunction, EffectOptions } from '../types'
import { Stack } from '../oby'

/* HELPERS */

const options: EffectOptions = {
  sync: 'init',
  stack: undefined
}

/* MAIN */

// This function exists for convenience, and to avoid creating unnecessary options objects

const useRenderEffect = (fn: EffectFunction, stack: Stack): Disposer => {

  return useEffect(fn, { ...options, stack })

}

/* EXPORT */

export default useRenderEffect