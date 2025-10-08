

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


//TODO: Support hot-swapping owner and context, to make the context JustWork™

export const KeepAlive = ({ id, ttl, children }: { id: FunctionMaybe<string>, ttl?: FunctionMaybe<number>, children: Child }): ObservableReadonly<Child> => {

  return useMemo((stack) => {

    return useResolved([id, ttl], (id, ttl) => {

      const lock = lockId++
      const item = cache[id] ||= { id, lock }

      item.lock = lock
      item.reset?.(stack)
      item.suspended ||= $(false)
      item.suspended(false)

      if (!item.dispose || !item.result) {

        runWithSuperRoot(() => {

          useRoot((stack, dispose) => {

            item.dispose = () => {

              delete cache[id]

              dispose(stack)

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