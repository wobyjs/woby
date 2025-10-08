/**
 * useMounted Hook
 * 
 * A hook that provides a ref and a mounted state for components. This hook is useful
 * for tracking when a component is mounted in the DOM and getting a reference to the DOM element.
 * 
 * @module useMounted
 */


import { Observable } from '../soby'
import { $ } from '../methods/soby'
import { $$ } from '../methods/soby'
import { useMemo } from './soby'

/**
 * useMounted Hook
 * 
 * Provides a ref and a mounted state for components. The hook returns an object with:
 * - ref: An observable reference to the DOM element
 * - isMounted: A memoized observable boolean indicating if the element is mounted
 * 
 * @template T - The type of HTMLElement
 * @param ref - Optional existing observable ref to use
 * @returns Object containing ref and isMounted properties
 * 
 * @example
 * ```tsx
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
 * const myRef = $<HTMLDivElement>()
 * const { isMounted } = useMounted(myRef)
 * 
 * return <div ref={myRef}>Hello World</div>
 * ```
 */
export function useMounted<T extends HTMLElement>(ref?: Observable<T>) {
  ref = ref ?? $<T>()
  const isMounted = useMemo(() => !!$$(ref))
  return { ref, isMounted }
}