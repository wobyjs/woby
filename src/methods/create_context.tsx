
/* IMPORT */

import { CONTEXTS_DATA, SYMBOL_CONTEXT_WRAP, SYMBOL_JSX, SYMBOL_DEFAULT } from '../constants'
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
  visible?: boolean
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

  // Create provider component - React-like invisible context provider
  const Provider = defaults(
    () => ({
      value: $<T>(undefined),
      ref: $<T>(undefined),
      children: $(undefined, HtmlChild),
      symbol: symbol,
      [SYMBOL_CONTEXT]: Context,
      isStatic: false
      // Note: visible is NOT in defaults - it should be undefined by default
      // so JSX providers are invisible unless visible={true} is explicitly passed
    } as { value: ObservableMaybe<T>, children: Child, isStatic?: boolean, visible?: boolean }),
    (props: ContextProviderProps): Child => {
      // Extract isStatic from props (already wrapped by defaults)
      const isStaticValue = $$(props?.isStatic as any)
      CONTEXTS_DATA.set(Context, { symbol, defaultValue, isStatic: isStatic(isStaticValue) })
      
      const { value, children, ref, ...restProps } = props as any
      const hasJSX = SYMBOL_JSX in restProps
      const visible = props?.visible ?? false

      // hasJSX = true (JSX usage): invisible like React, unless visible={true} opts in to DOM node
      // hasJSX = false (native browser customElement): <context-provider> IS a DOM node
      if (!hasJSX || visible) {
        return jsx('context-provider', { ref, value, symbol, children })
      }

      // Default JSX behavior: invisible provider, context propagated via Soby
      return context({ [symbol]: value }, () => resolve($$(children as any)))
    }
  )

  const Context = { Provider, symbol/* , value */ }

  return Context

} 
