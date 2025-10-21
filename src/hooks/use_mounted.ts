/**
 * useMounted Hook
 * 
 * A hook that provides a ref and a mounted state for components. This hook is useful
 * for tracking when a component is mounted in the DOM and getting a reference to the DOM element.
 * 
 * The hook returns an object with:
 * - ref: An observable reference to the DOM element (uses external ref if provided, otherwise creates a new one)
 * - isMounted: A memoized observable boolean indicating if the element is mounted
 * - mount: A comment node used for debugging mount operations (only when no external ref is provided)
 * 
 * @module useMounted
 */

import { Observable } from '../soby'
import { $ } from '../methods/soby'
import { $$ } from '../methods/soby'
import { useMemo } from './soby'
import { mark } from '../utils/mark'

/**
 * useMounted Hook
 * 
 * Provides a ref and a mounted state for components. 
 * - If an external ref is provided, it will be used
 * - If no ref is provided, a new one will be created internally
 * - The mount property provides a comment node for debugging (only when no external ref is provided)
 * 
 * @template T - The type of HTMLElement
 * @param ref - Optional existing observable ref to use
 * @returns Object containing ref, isMounted, and mount properties
 * 
 * @example
 * ```tsx
 * // Using internally created ref
 * const { ref, isMounted } = useMounted<HTMLDivElement>()
 * 
 * useEffect(() => {
 *   if ($$(isMounted)) {
 *     console.log('Component is mounted')
 *   }
 * })
 * 
 * return <div ref={ref}>Hello World</div>
 * ```
 * 
 * @example
 * ```tsx
 * // Using externally provided ref
 * const myRef = $<HTMLDivElement>()
 * const { isMounted } = useMounted(myRef)
 * 
 * return <div ref={myRef}>Hello World</div>
 * ```
 * 
 * @example
 * ```tsx
 * // With debugging enabled and internal ref, a comment node will be created to track mount
 * const { ref, isMounted, mount } = useMounted<HTMLDivElement>()
 * 
 * return (
 *   <>
 *     {mount}
 *     <div ref={ref}>Hello World</div>
 *   </>
 * )
 * ```
 */
export function useMounted<T extends HTMLElement>(ref?: Observable<T>) {
  // If a ref is provided externally, use it; otherwise create a new one
  const given = !!ref
  const internalRef = ref ?? $<T>()

  // isMounted is true when the ref is attached to a DOM element
  const isMounted = useMemo(() => !!$$(internalRef))

  // Only create a mount point (comment node) for debugging when no external ref is provided
  const mount = !given ? mark('mount', internalRef) : undefined

  // Return the appropriate ref based on whether one was provided
  return {
    ref: internalRef,
    isMounted,
    mount: mount
  }
}
