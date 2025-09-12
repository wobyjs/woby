/**
 * useMountedContext Hook
 * 
 * A hook that provides context values for components, with special support for custom elements.
 * This hook works in both JSX/TSX components and custom elements defined in HTML.
 * 
 * For custom elements, it attempts to retrieve context from the parent element's context property.
 * For JSX/TSX components, it falls back to the standard useContext hook.
 * 
 * @module useMountedContext
 */

/* IMPORT */

import { Observable } from '../soby'
import $ from '../methods/S'
import $$ from '../methods/SS'
import useMemo from './use_memo'
import useContext from './use_context'
import { Context, ContextWithDefault, ObservableReadonly } from '~/types'

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
 * @returns Object containing ref and context, or just the context value
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
 * ```html
 * <!-- Usage in HTML custom elements -->
 * <counter-element>
 *   <counter-element><!-- This child can access parent's context --></counter-element>
 * </counter-element>
 * ```
 */
export function useMountedContext<T, E extends HTMLElement>(Context: ContextWithDefault<T> | Context<T>): { ref: Observable<E>, context: ObservableReadonly<T> }
export function useMountedContext<T, E extends HTMLElement>(Context: ContextWithDefault<T> | Context<T>, ref: Observable<E>): ObservableReadonly<T>
export function useMountedContext<T, E extends HTMLElement>(Context: ContextWithDefault<T> | Context<T>, ref?: Observable<E>): ObservableReadonly<T> | { ref: Observable<E>, context: ObservableReadonly<T> } {
  const r = ref
  ref = r ?? $<E>()
  const context = useMemo(() => $$(ref)?.parentElement?.[Context.symbol] ?? useContext(Context))

  if (!r)
    return { ref, context }
  return context
}