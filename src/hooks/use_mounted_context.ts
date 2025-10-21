/**
 * useMountedContext Hook
 * 
 * A specialized hook that provides context values for components with enhanced support 
 * for custom elements. This hook works in both JSX/TSX components and custom elements 
 * defined in HTML, providing seamless context access across both paradigms.
 * 
 * For custom elements, it attempts to retrieve context from the parent element's 
 * context property by traversing the DOM tree. For JSX/TSX components, it falls back 
 * to the standard useContext hook.
 * 
 * @module useMountedContext
 */

import { $$ } from '../methods/soby'
import { useMemo } from './soby'
import { Context, ContextWithDefault } from '../types'
import type { ObservableMaybe } from '../types'
import { useAttached } from './use_attached'
import { Observable } from 'soby'

/**
 * useMountedContext Hook
 * 
 * Provides context values for components with support for both JSX/TSX and custom elements.
 * When used without a ref parameter, it returns both a ref and the context value.
 * When used with a ref parameter, it returns only the context value.
 * 
 * For custom elements, it attempts to retrieve context from the parent element's context property.
 * For JSX/TSX components, it falls back to the standard useContext hook.
 * 
 * @template T - The type of the context value
 * @template E - The type of HTMLElement
 * @param Context - The context object created with createContext
 * @param ref - Optional existing observable ref to use
 * @returns When used with destructuring as [context, mount], returns a tuple with the context value and a mounting placeholder comment element
 * 
 * @example
 * ```tsx
 * // Usage without ref (returns both ref and context)
 * const CounterContext = createContext<number>(0)
 * const { ref, context } = useMountedContext(CounterContext)
 * 
 * return <div ref={ref}>Context value: {context}</div>
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with existing ref (returns only context)
 * const CounterContext = createContext<number>(0)
 * const myRef = $<HTMLDivElement>()
 * const context = useMountedContext(CounterContext, myRef)
 * 
 * return <div ref={myRef}>Context value: {context}</div>
 * ```
 * 
 * @example
 * ```tsx
 * // Usage in custom elements for rendering only (mount is auto taken care of)
 * const CounterContext = createContext<number>(0)
 * const context = useMountedContext(CounterContext) //direct use
 * 
 * return <span>(Context Value = <b>{context}</b>)</span>
 * ```
 * 
 * @example
 * ```tsx
 * // Usage in custom elements with manual mounting (required when processing context value)
 * const CounterContext = createContext<number>(0)
 * const [context, m] = useMountedContext(CounterContext)
 * // Must put in {m} mounting component manually to receive context
 * return <span>(Processed Context Value = <b>{useMemo(() => $$($$(context)) + ' Processed')}</b>){m}</span>
 * ```
 * 
 * @example
 * ```html
 * <!-- Usage in HTML custom elements -->
 * <counter-context-provider value="42">
 *   <counter-display><!-- This child can access parent's context --></counter-display>
 * </counter-context-provider>
 * ```
 * 
 * @example
 * ```tsx
 * // Custom element implementation using useMountedContext
 * const CounterDisplay = defaults(() => ({}), () => {
 *   const [context, mount] = useMountedContext(CounterContext)
 *   return <div>{mount}Count: {context}</div>
 * })
 * 
 * customElement('counter-display', CounterDisplay)
 * ```
 */
export function useMountedContext<T, E extends HTMLElement>(ctx: ContextWithDefault<T> | Context<T>, ref?: ObservableMaybe<Node>) {
  const { parent: provider, ref: rf, mount } = useAttached(ref, p => (p as Element).tagName === 'CONTEXT-PROVIDER' && !!p?.[ctx.symbol])

  const context = useMemo(() => {
    if (!$$(provider)) return
    return $$(provider)?.[ctx.symbol]
  })
  Object.defineProperties(context, {
    length: {
      value: 2,
      writable: false,
      enumerable: false,
      configurable: false
    }
  })

  return Object.assign([context, mount], context, { mount, ref: rf, context }) //as JSX.Child //& Observable<T> & { mount: typeof mount, ref: Observable<Node> }
  // return { mount, ref: rf, context }
}

