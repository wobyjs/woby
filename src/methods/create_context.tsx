
/* IMPORT */

import { CONTEXTS_DATA, SYMBOL_ISSLOT } from '../constants'
// import {resolve} from '../utils/resolve';
import { $, $$, context, isObservable, resolve } from './soby'
import type { Child, Context, ObservableMaybe, ContextWithDefault } from '../types'
import { defaults } from './defaults'
import { HtmlChild } from '../html/html-child'
import { useEffect } from '../hooks'
import { SYMBOL_CONTEXT } from '../constants'

/* MAIN */


export function createContext<T>(defaultValue: T): ContextWithDefault<T>
export function createContext<T>(defaultValue?: T): Context<T>
export function createContext<T>(defaultValue?: T): ContextWithDefault<T> | Context<T> {

  const symbol = Symbol()

  const Provider = defaults(
    () => ({
      value: $<T>(undefined),
      ref: $<T>(undefined),
      children: $(undefined, HtmlChild),
      symbol: symbol,
      [SYMBOL_CONTEXT]: Context
    } as { value: ObservableMaybe<T>, children: Child }),
    ({ value, children, ref, ...props }): Child => {

      return context({ [symbol]: value }, () => resolve(children))

    }
  )

  const Context = { Provider, symbol/* , value */ }

  CONTEXTS_DATA.set(Context, { symbol, defaultValue })

  return Context

} 
