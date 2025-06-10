
/* IMPORT */

import useEffect from '../hooks/use_effect'
import type { Disposer, EffectFunction, EffectOptions } from '../types'

/* HELPERS */

const options: EffectOptions = {
  sync: 'init',
  stack: undefined
}

/* MAIN */

// This function exists for convenience, and to avoid creating unnecessary options objects

const useRenderEffect = (fn: EffectFunction, stack: Error): Disposer => {

  return useEffect(fn, { ...options, stack })

}

/* EXPORT */

export default useRenderEffect