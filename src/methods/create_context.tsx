
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
import { HtmlHidden } from '../html/html-hidden'

/* MAIN */


// Define the props interface explicitly to help with type generation
interface ContextProviderProps {
  value?: ObservableMaybe<any>
  children?: ObservableMaybe<Child>
  symbol?: ObservableMaybe<Symbol>
  isStatic?: boolean
}

const ContextProvider = defaults(
  (): ContextProviderProps => ({
    value: $(undefined),
    children: $(undefined),
    symbol: $<Symbol>(Symbol(Math.random() + ''), HtmlHidden)
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
  const isStatic = $(false)

  // Create provider component that intercepts isStatic before defaults wraps it
  const Provider = ((rawProps: any) => {
    // Extract isStatic from raw props BEFORE defaults processes them
    const providerIsStatic = rawProps?.isStatic
    
    // Set isStatic in CONTEXTS_DATA before checking JSX
    if (providerIsStatic !== undefined) {
      isStatic(providerIsStatic)
    }
    CONTEXTS_DATA.set(Context, { symbol, defaultValue, isStatic })
    
    // Now call defaults with remaining props
    return defaults(
      () => ({
        value: $<T>(undefined),
        ref: $<T>(undefined),
        children: $(undefined, HtmlChild),
        symbol: symbol,
        [SYMBOL_CONTEXT]: Context
      } as { value: ObservableMaybe<T>, children: Child }),
      (props): Child => {
        const { value, children, ref, ...restProps } = props as any

        if (SYMBOL_JSX in restProps) {
          const child = $()

          return jsx('context-provider', {
            ref,
            value,
            symbol,
            children,
          })
        }

        return context({ [symbol]: value }, () => resolve(children))
      }
    )(rawProps)
  }) as any

  const Context = { Provider, symbol/* , value */ }

  return Context

} 
