///** @jsxImportSource ../jsx/runtime */

import { useEffect, useMemo } from '../hooks'
import { defaults } from './defaults'
import { CONTEXTS_DATA, SYMBOL_DEFAULT } from '../constants'
import { $, $$, resolve } from './soby'
import { context, Observable } from '../soby'
import type { Child, Context, ContextWithDefault } from '../types'
import { jsx, unwrapJsx } from '../jsx/runtime'
import { customElement, ElementAttributes } from './custom_element'

// export const webComponentMap: Record<symbol, any> = {}

// const WobyContext = defaults(() => ({}), ({ children, ...props }: { children: JSX.Children, ref?: JSX.Ref }) => {
//   const ref = $<Comment>()
//   useEffect(() => console.log('woby-context', $$(ref), $$(children)))
//   return [
//     jsx('comment', { ref, data: ' ref ' }),
//     resolve(children)
//   ]
// })

// customElement('woby-context', WobyContext)

// declare module '..' {
//   namespace JSX {
//     interface IntrinsicElements {
//       'woby-context': ElementAttributes<typeof WobyContext>
//     }
//   }
// }

/**
 * Creates a context object that can be used to pass data through the component tree
 * without having to pass props down manually at every level.
 * 
 * The context object has a Provider component that allows consuming components to subscribe
 * to context changes. The Provider component accepts a `value` prop that will be passed to
 * all components that are descendants of the Provider.
 * 
 * @template T - The type of the context value
 * @param defaultValue - The default value for the context when no Provider is found
 * @returns A context object with a Provider component and a symbol for internal use
 * 
 * @example
 * ```tsx
 * // Create a context with a default value
 * const ThemeContext = createContext('light')
 * 
 * // Create a context without a default value
 * const UserContext = createContext<User | undefined>(undefined)
 * 
 * // Use the Provider to pass a value down the tree
 * const App = () => (
 *   <ThemeContext.Provider value="dark">
 *     <Toolbar />
 *   </ThemeContext.Provider>
 * )
 * 
 * // Consume the context value in a component
 * const ThemedButton = () => {
 *   const theme = useContext(ThemeContext)
 *   return <button className={theme}>Themed Button</button>
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Using context with custom elements
 * const ValueContext = createContext(0)
 * 
 * // Provider works with both JSX and custom elements
 * customElement('value-display', ({ value }: { value: Observable<number> }) => {
 *   const context = useContext(ValueContext)
 *   return <div>Value: {value}, Context: {context}</div>
 * })
 * 
 * // In JSX:
 * // <ValueContext.Provider value={42}>
 * //   <value-display></value-display>
 * // </ValueContext.Provider>
 * ```
 */
export function createContext<T>(defaultValue: T): ContextWithDefault<T>
export function createContext<T>(defaultValue?: T): Context<T>
export function createContext<T>(defaultValue?: T): ContextWithDefault<T> | Context<T> {

  const symbol = Symbol()

  const Provider = ({ value, children, ref }: { value: T, children: Child, ref?: Observable<Node> }): Child => {
    return context({ [symbol]: value }, () => {
      // webComponentMap[symbol] = value

      // const ref = $<Comment>()
      useEffect(() => {
        // if ($$(children))
        //   [$$(children)].flat().forEach(c => c instanceof HTMLElement && (c[symbol] = value))
        // if (customElements.get($$(ref)?.parentElement.tagName.toLocaleLowerCase()))
        if (!$$(ref)) return
        $$(ref)[symbol] = value
        // $$(ref).parentElement[symbol] = value
        console.log('comment ref', $$(ref), $$(ref)?.parentElement, $$(ref)?.childNodes)
        // return () => delete webComponentMap[symbol]
      })

      // const props = { ref, children }

      // //can't use jsx syntax here,
      //cannot use nested slot or double slot 
      // const r = jsx('woby-context', props)

      // unwrapJsx(props)
      // return r

      // return <woby-context ref={ref}>{children}</woby-context>

      return [
        jsx('comment', { ref, data: 'ctx' }),
        resolve(children)
      ]
    })
  }

  const Context = { Provider, symbol }

  CONTEXTS_DATA.set(Context as any, { symbol, defaultValue })

  return Context

}
