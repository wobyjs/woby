
/* IMPORT */

import { CONTEXTS_DATA, SYMBOL_CONTEXT_WRAP, SYMBOL_JSX } from '../constants'
// import {resolve} from '../utils/resolve';
import { $, $$, context, resolve } from './soby'
import type { Child, Context, ObservableMaybe, ContextWithDefault } from '../types'
import { defaults } from './defaults'
import { HtmlChild } from '../html/html-child'
import { SYMBOL_CONTEXT } from '../constants'
import { jsx } from '../jsx-runtime'
import { customElement, ElementAttributes } from './custom_element'
import { HtmlSymbol } from '../html/html-symbol'

/* MAIN */


// Define the props interface explicitly to help with type generation
interface ContextProviderProps {
  value?: ObservableMaybe<any>
  children?: ObservableMaybe<Child>
  symbol?: ObservableMaybe<Symbol>
}

const ContextProvider = defaults(
  (): ContextProviderProps => ({
    value: $(undefined),
    children: $(undefined),
    symbol: $<Symbol>(Symbol(Math.random() + ''), HtmlSymbol)
  }),
  ({ children, symbol, value }: ContextProviderProps) => {
    return Object.assign(context({ [$$(symbol) as symbol]: value }, () => {
      // console.log('[context]', /* symbol, */ $$(context($$(symbol))), $$(value))
      return resolve($$(children))
    }), { symbol })
  })

customElement('context-provider', ContextProvider)

declare module '../index' {
  namespace JSX {
    interface IntrinsicElements {
      'context-provider': ElementAttributes<typeof ContextProvider>
    }
  }
}

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

      if (SYMBOL_JSX in props) {
        const child = $()

        return jsx('context-provider', {
          ref,
          value,
          symbol, //: $(symbol, hidden),
          children, //: child//resolve(children) //must resolve, for non dom
        })
      }

      return context({ [symbol]: value }, () => resolve(children))

    }
  )

  const Context = { Provider, symbol/* , value */ }

  CONTEXTS_DATA.set(Context, { symbol, defaultValue })

  return Context

} 
