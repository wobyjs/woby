

import { useCleanup } from '../hooks/soby'
import { useMemo } from '../hooks/soby'
import { useResolved } from '../hooks/use_resolved'
import { useRoot } from '../hooks/soby'
import { useSuspense } from '../hooks/soby'
import { resolve } from '../methods/soby'
import { $ } from '../methods/soby'
import { with as _with } from 'soby'
import type { Child, Disposer, FunctionMaybe, Observable, ObservableReadonly } from '../types'

/* TYPES */

type Item = {
  id: string,
  lock: number,
  result?: Child,
  suspended?: Observable<boolean>,
  dispose?: Disposer,
  reset?: Disposer
}

/* HELPERS */

const cache: Record<string, Item> = {}
const runWithSuperRoot = _with()

let lockId = 1
const MAX_CACHE_SIZE = 100 // Maximum number of cached items to prevent unbounded growth


//TODO: Support hot-swapping owner and context, to make the context JustWork™

export const KeepAlive = ({ id, ttl, children }: { id: FunctionMaybe<string>, ttl?: FunctionMaybe<number>, children: Child }): ObservableReadonly<Child> => {

  return useMemo((stack) => {

    return useResolved([id, ttl], (id, ttl) => {

      const lock = lockId++
      const isNew = !(id in cache)
      const item = cache[id] ||= { id, lock }

      // Enforce cache size limit — evict oldest entries when adding a new id
      if (isNew && Object.keys(cache).length > MAX_CACHE_SIZE) {
        const sortedKeys = Object.keys(cache).sort((a, b) => cache[a].lock - cache[b].lock)
        for (const key of sortedKeys) {
          if (Object.keys(cache).length <= MAX_CACHE_SIZE) break
          cache[key].dispose?.()
        }
      }

      item.lock = lock
      item.reset?.(stack)
      item.suspended ||= $(false)
      item.suspended(false)

      if (!item.dispose || !item.result) {

        runWithSuperRoot(() => {

          useRoot((dispose) => {

            item.dispose = () => {

              delete cache[id]

              dispose()

            }

            useSuspense(item.suspended, () => {

              item.result = resolve(children)

            }, stack)

          })

        }, stack)

      }

      useCleanup(() => {

        const hasLock = () => lock === item.lock

        if (!hasLock()) return

        item.suspended?.(true)

        if (!ttl || ttl <= 0 || ttl >= Infinity) return

        const dispose = () => hasLock() && item.dispose?.(stack)
        const timeoutId = setTimeout(dispose, ttl)
        const reset = () => clearTimeout(timeoutId)

        item.reset = reset

      })

      return item.result

    })

  })

}