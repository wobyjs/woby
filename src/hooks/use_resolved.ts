

import { isObservable } from '../methods/soby'
import { isArray, isFunction } from '../utils/lang'
import type { FN, ObservableReadonly } from '../types'

/* HELPERS */

type F<T> = T extends () => infer U ? U : T
type O<T> = T extends ObservableReadonly<infer U> ? U : T


//TODO: Maybe port this to soby, as "resolved"

export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8, T9>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8, T9], resolveFunction?: true): [F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>, F<T7>, F<T8>, F<T9>]
export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8], resolveFunction?: true): [F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>, F<T7>, F<T8>]
export function useResolved<T1, T2, T3, T4, T5, T6, T7>(value: readonly [T1, T2, T3, T4, T5, T6, T7], resolveFunction?: true): [F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>, F<T7>]
export function useResolved<T1, T2, T3, T4, T5, T6>(value: readonly [T1, T2, T3, T4, T5, T6], resolveFunction?: true): [F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>]
export function useResolved<T1, T2, T3, T4, T5>(value: readonly [T1, T2, T3, T4, T5], resolveFunction?: true): [F<T1>, F<T2>, F<T3>, F<T4>, F<T5>]
export function useResolved<T1, T2, T3, T4>(value: readonly [T1, T2, T3, T4], resolveFunction?: true): [F<T1>, F<T2>, F<T3>, F<T4>]
export function useResolved<T1, T2, T3>(value: readonly [T1, T2, T3], resolveFunction?: true): [F<T1>, F<T2>, F<T3>]
export function useResolved<T1, T2>(value: readonly [T1, T2], resolveFunction?: true): [F<T1>, F<T2>]
export function useResolved<T1>(value: readonly [T1], resolveFunction?: true): [F<T1>]
export function useResolved(value: readonly [], resolveFunction?: true): []

export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8, T9>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8, T9], resolveFunction: false): [O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>, O<T8>, O<T9>]
export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8], resolveFunction: false): [O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>, O<T8>]
export function useResolved<T1, T2, T3, T4, T5, T6, T7>(value: readonly [T1, T2, T3, T4, T5, T6, T7], resolveFunction: false): [O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>]
export function useResolved<T1, T2, T3, T4, T5, T6>(value: readonly [T1, T2, T3, T4, T5, T6], resolveFunction: false): [O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>]
export function useResolved<T1, T2, T3, T4, T5>(value: readonly [T1, T2, T3, T4, T5], resolveFunction: false): [O<T1>, O<T2>, O<T3>, O<T4>, O<T5>]
export function useResolved<T1, T2, T3, T4>(value: readonly [T1, T2, T3, T4], resolveFunction: false): [O<T1>, O<T2>, O<T3>, O<T4>]
export function useResolved<T1, T2, T3>(value: readonly [T1, T2, T3], resolveFunction: false): [O<T1>, O<T2>, O<T3>]
export function useResolved<T1, T2>(value: readonly [T1, T2], resolveFunction: false): [O<T1>, O<T2>]
export function useResolved<T1>(value: readonly [T1], resolveFunction: false): [O<T1>]
export function useResolved(value: readonly [], resolveFunction: false): []

export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8, T9], callback: FN<[F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>, F<T7>, F<T8>, F<T9>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8, R>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8], callback: FN<[F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>, F<T7>, F<T8>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, T3, T4, T5, T6, T7, R>(value: readonly [T1, T2, T3, T4, T5, T6, T7], callback: FN<[F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>, F<T7>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, T3, T4, T5, T6, R>(value: readonly [T1, T2, T3, T4, T5, T6], callback: FN<[F<T1>, F<T2>, F<T3>, F<T4>, F<T5>, F<T6>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, T3, T4, T5, R>(value: readonly [T1, T2, T3, T4, T5], callback: FN<[F<T1>, F<T2>, F<T3>, F<T4>, F<T5>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, T3, T4, R>(value: readonly [T1, T2, T3, T4], callback: FN<[F<T1>, F<T2>, F<T3>, F<T4>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, T3, R>(value: readonly [T1, T2, T3], callback: FN<[F<T1>, F<T2>, F<T3>], R>, resolveFunction?: true): R
export function useResolved<T1, T2, R>(value: readonly [T1, T2], callback: FN<[F<T1>, F<T2>], R>, resolveFunction?: true): R
export function useResolved<T1, R>(value: readonly [T1], callback: FN<[F<T1>], R>, resolveFunction?: true): R
export function useResolved<R>(value: readonly [], callback: FN<[], R>, resolveFunction?: true): R

export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8, T9], callback: FN<[O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>, O<T8>, O<T9>], R>, resolveFunction: false): R
export function useResolved<T1, T2, T3, T4, T5, T6, T7, T8, R>(value: readonly [T1, T2, T3, T4, T5, T6, T7, T8], callback: FN<[O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>, O<T8>], R>, resolveFunction: false): R
export function useResolved<T1, T2, T3, T4, T5, T6, T7, R>(value: readonly [T1, T2, T3, T4, T5, T6, T7], callback: FN<[O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>, O<T7>], R>, resolveFunction: false): R
export function useResolved<T1, T2, T3, T4, T5, T6, R>(value: readonly [T1, T2, T3, T4, T5, T6], callback: FN<[O<T1>, O<T2>, O<T3>, O<T4>, O<T5>, O<T6>], R>, resolveFunction: false): R
export function useResolved<T1, T2, T3, T4, T5, R>(value: readonly [T1, T2, T3, T4, T5], callback: FN<[O<T1>, O<T2>, O<T3>, O<T4>, O<T5>], R>, resolveFunction: false): R
export function useResolved<T1, T2, T3, T4, R>(value: readonly [T1, T2, T3, T4], callback: FN<[O<T1>, O<T2>, O<T3>, O<T4>], R>, resolveFunction: false): R
export function useResolved<T1, T2, T3, R>(value: readonly [T1, T2, T3], callback: FN<[O<T1>, O<T2>, O<T3>], R>, resolveFunction: false): R
export function useResolved<T1, T2, R>(value: readonly [T1, T2], callback: FN<[O<T1>, O<T2>], R>, resolveFunction: false): R
export function useResolved<T1, R>(value: readonly [T1], callback: FN<[O<T1>], R>, resolveFunction: false): R
export function useResolved<R>(value: readonly [], callback: FN<[], R>, resolveFunction: false): R

export function useResolved<T>(value: T, resolveFunction?: true): F<T>
export function useResolved<T>(value: T, resolveFunction: false): O<T>

export function useResolved<T, R>(value: T, callback: FN<[F<T>], R>, resolveFunction?: true): R
export function useResolved<T, R>(value: T, callback: FN<[O<T>], R>, resolveFunction: false): R

export function useResolved(values: any, callback: any, resolveFunction?: boolean) {

  const isResolvable = (resolveFunction !== false && callback !== false) ? isFunction : isObservable
  const resolve = (value: any) => isResolvable(value) ? value() : value

  if (isArray(values)) {

    const resolved = values.map(resolve)

    if (isFunction(callback)) {

      return callback.apply(undefined, resolved)

    } else {

      return resolved

    }

  } else {

    const resolved = resolve(values)

    if (isFunction(callback)) {

      return callback(resolved)

    } else {

      return resolved

    }

  }

}
