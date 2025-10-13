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

import { $ } from '../methods/soby'
import { $$ } from '../methods/soby'
import { useMemo } from './soby'
import { useContext } from './use_context'
import { Context, ContextWithDefault, ObservableReadonly } from '../types'
import { jsx } from '../jsx-runtime'
import type { Child } from '../types'
import { DEBUGGER } from 'soby'

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
export function useMountedContext<T, E extends HTMLElement>(Context: ContextWithDefault<T> | Context<T>): [ObservableReadonly<T>, Child] {
  const ref = $<E>()
  const ctx = useMemo(() => {
    if (!$$(ref)) return undefined

    const element = $$(ref) as unknown as Element
    const root = element.getRootNode()
    if (root === document) {
      if (element.parentElement && element.parentElement.firstChild && element.parentElement.firstChild[Context.symbol]) {
        return element.parentElement.firstChild[Context.symbol]
      } else {
        // Traverse up if parentElement.firstChild[Context.symbol] not found
        const traverseUp = (elem: Element | null): any => {
          if (!elem) return undefined
          if (elem.parentElement && elem.parentElement.firstChild && elem.parentElement.firstChild[Context.symbol]) {
            return elem.parentElement.firstChild[Context.symbol]
          }
          if (elem.parentElement) {
            return traverseUp(elem.parentElement)
          }
          return undefined
        }
        return traverseUp(element.parentElement)
      }
    }
    //shadow dom
    if (root instanceof ShadowRoot) {
      // Handle various shadow DOM scenarios including slots
      const host = root.host

      // Helper function to traverse up through slots and shadow roots
      const traverseUp = (elem: Element | null): any => {
        if (!elem) return undefined

        // Context is always stored at parent.firstChild[Context.symbol]
        if (elem.parentElement && elem.parentElement.firstChild && elem.parentElement.firstChild[Context.symbol]) {
          return elem.parentElement.firstChild[Context.symbol]
        }

        // If element is assigned to a slot, traverse up through the slot
        if (elem.assignedSlot) {
          const slot = elem.assignedSlot
          // Check if slot's parent element's first child has the context
          if (slot.parentElement && slot.parentElement.firstChild && slot.parentElement.firstChild[Context.symbol]) {
            return slot.parentElement.firstChild[Context.symbol]
          }

          // Get the root node of the slot and traverse up
          const slotRoot = slot.getRootNode()
          if (slotRoot instanceof ShadowRoot) {
            // We're in the parent's shadow DOM, check the host's parent
            if (slotRoot.host.parentElement && slotRoot.host.parentElement.firstChild && slotRoot.host.parentElement.firstChild[Context.symbol]) {
              return slotRoot.host.parentElement.firstChild[Context.symbol]
            }
            return traverseUp(slotRoot.host)
          } else {
            // If not a ShadowRoot, continue traversal from the slot's parent
            return traverseUp(slot.parentElement)
          }
        }

        // Check first child for context (in case this element has children with context)
        if (elem.firstElementChild && elem.firstElementChild[Context.symbol]) {
          return elem.firstElementChild[Context.symbol]
        }

        // If element has a parent, continue traversal
        if (elem.parentElement) {
          return traverseUp(elem.parentElement)
        }

        return undefined
      }

      // Case 1: Try to find context by traversing up from host's parent
      if (host.parentElement) {
        const contextValue = traverseUp(host.parentElement)
        if (contextValue !== undefined) {
          return contextValue
        }
      }

      // Case 2: Check if host itself is assigned to a slot and traverse up through that slot
      if (host.assignedSlot) {
        const slotContext = traverseUp(host.assignedSlot)
        if (slotContext !== undefined) {
          return slotContext
        }
      }

      // Case 3: Direct host context access (check host's parent first child)
      if (host.parentElement && host.parentElement.firstChild && host.parentElement.firstChild[Context.symbol]) {
        return host.parentElement.firstChild[Context.symbol]
      }

      // Case 4: Check first child of host for context
      if (host.firstElementChild && host.firstElementChild[Context.symbol]) {
        return host.firstElementChild[Context.symbol]
      }

      // Fallback to standard useContext if no context found in ShadowRoot hierarchy
      return useContext(Context)
    }

    // Regular DOM element context lookup
    if (element.parentElement) {
      // Helper function to traverse up for regular DOM elements
      const traverseUp = (elem: Element | null): any => {
        if (!elem) return undefined

        // Context is always stored at parent.firstChild[Context.symbol]
        if (elem.parentElement && elem.parentElement.firstChild && elem.parentElement.firstChild[Context.symbol]) {
          return elem.parentElement.firstChild[Context.symbol]
        }

        // If element is assigned to a slot, traverse up through the slot
        if (elem.assignedSlot) {
          const slot = elem.assignedSlot
          // Check if slot's parent element's first child has the context
          if (slot.parentElement && slot.parentElement.firstChild && slot.parentElement.firstChild[Context.symbol]) {
            return slot.parentElement.firstChild[Context.symbol]
          }

          // Get the root node of the slot
          const slotRoot = slot.getRootNode()
          // If the root is a ShadowRoot, continue traversal from the host
          if (slotRoot instanceof ShadowRoot) {
            // Check host's parent first child for context
            if (slotRoot.host.parentElement && slotRoot.host.parentElement.firstChild && slotRoot.host.parentElement.firstChild[Context.symbol]) {
              return slotRoot.host.parentElement.firstChild[Context.symbol]
            }
            return traverseUp(slotRoot.host)
          } else {
            // If not a ShadowRoot, continue traversal from the slot's parent
            return traverseUp(slot.parentElement)
          }
        }

        // Check first child for context (in case this element has children with context)
        if (elem.firstElementChild && elem.firstElementChild[Context.symbol]) {
          return elem.firstElementChild[Context.symbol]
        }

        // If element has a parent, continue traversal
        if (elem.parentElement) {
          return traverseUp(elem.parentElement)
        }

        return undefined
      }

      const result = traverseUp(element.parentElement)
      if (result !== undefined) {
        return result
      }
    }

    // Fallback to standard useContext if no context found in DOM hierarchy
    return useContext(Context)
  })

  return [ctx, jsx('comment', { ref, data: DEBUGGER.verboseComment ? 'mount' : '' })]
}