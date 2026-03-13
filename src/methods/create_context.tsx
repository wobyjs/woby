
/* IMPORT */

import { CONTEXTS_DATA, SYMBOL_ISSLOT } from '../constants'
// import {resolve} from '../utils/resolve';
import { $, $$, context, isObservable, resolve } from './soby'
import type { Child, Context, ObservableMaybe, ContextWithDefault } from '../types'
import { defaults } from './defaults'
import { HtmlChild } from '../html/html-child'
import { useEffect } from '../hooks'
import { SYMBOL_CONTEXT, __temp__, } from '../constants'

/* MAIN */


export function createContext<T>(defaultValue: T): ContextWithDefault<T>
export function createContext<T>(defaultValue?: T): Context<T>
export function createContext<T>(defaultValue?: T): ContextWithDefault<T> | Context<T> {

  const symbol = Symbol(Math.random() + '')
  // const value = $<T>(undefined)

  const Provider = defaults(
    () => ({
      value: $<T>(undefined),
      ref: $<T>(undefined),
      children: $(undefined, HtmlChild),
      symbol: symbol,
      [SYMBOL_CONTEXT]: Context
    } as { value: ObservableMaybe<T>, children: Child }),
    ({ value, children, ref, ...props }): Child => {

      // const symbol = props[SYMBOL_CONTEXT]

      return context({ [symbol]: value }, () => {
        defaultValue
        console.log('[createContext] __temp__', context(__temp__))

        console.log('[createContext] context: ', symbol, $$(value), $$(context(symbol)))
        useEffect(() => console.log('[createContext] context useEffect: ', symbol, $$(value), $$(context(symbol))))

        const ret = resolve(children)

        useEffect(() => {
          console.log('[createContext] useEffect __temp__', context(__temp__))
          console.log('[createContext] ref', $$(ref), $$(ref).shadowRoot, $$(ref).shadowRoot.querySelectorAll('slot')[0])
        })

        const ob = resolve(ret)
        if (isObservable(ob)) {
          const slots = $$(ob) as HTMLSlotElement
          slots.addEventListener('slotchange', (evt) => {
            console.log('[slotchange]', evt.target)
          })
          return slots
        }

        return ret
      })

    }
  )

  const Context = { Provider, symbol/* , value */ }

  CONTEXTS_DATA.set(Context, { symbol, defaultValue })

  return Context

} 
