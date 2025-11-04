/**
 * A specialized effect hook that runs synchronously during rendering.
 * 
 * This is a convenience wrapper around useEffect with synchronous execution options.
 * Like all Woby effects, it automatically tracks dependencies without requiring
 * a dependency array.
 * 
 * @example
 * ```typescript
 * // ✅ Correct Woby pattern - no dependency array needed
 * useRenderEffect(() => {
 *   console.log($(count)) // Automatically tracks 'count' as a dependency
 * })
 * ```
 * 
 * @param fn - The effect function to run synchronously during rendering
 * @param stack - The stack trace for debugging
 * @returns A disposer function to clean up the effect
 * 
 * @see {@link useEffect} for the general effect hook
 * @see {@link useMemo} for creating memoized computed values
 */

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