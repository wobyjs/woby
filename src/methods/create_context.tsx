import { useEffect } from '../hooks'
import { CONTEXTS_DATA, } from '../constants'
import { $, $$ } from './soby'
import { context, ObservableOptions, resolve } from '../soby'
import type { Child, Context, ContextWithDefault, ObservableMaybe } from '../types'
import { } from '../soby'
import { defaults } from './defaults'
import { customElement, ElementAttributes } from './custom_element'
import { jsx } from '../jsx-runtime'

// const serializer = { toHtml: (o) => o + '', fromHtml: o => o } as ObservableOptions
const hidden = { toHtml: o => undefined } as ObservableOptions

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
    symbol: $<Symbol>(undefined)
  }),
  ({ children }: ContextProviderProps) => {
    return children
  }
)

customElement('context-provider', ContextProvider)

declare module '../index' {
  namespace JSX {
    interface IntrinsicElements {
      'context-provider': ElementAttributes<typeof ContextProvider>
    }
  }
}


/**
 * Context API for Woby Framework
 *
 * This module provides the createContext function which creates a context object that can be used
 * to pass data through the component tree without having to pass props down manually at every level.
 * It supports both JSX components and custom elements with special context handling.
 *
 * @module createContext
 */
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
  * customElement('value-display', ({value}: {value: Observable<number> }) => {
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

  const Provider = ({ value, children }: { value: T, children: Child }): Child => {
    return context({ [symbol]: value }, () => {
      const ref = $<Comment>()

      useEffect(() => {
        if (!$$(ref)) return
        $$(ref)[symbol] = value
        return () => delete $$(ref)[symbol]
      })

      return jsx('context-provider', {
        ref,
        value,
        symbol: $(symbol, hidden),
        children: resolve(children) //must resolve, for non dom
      })
    })
  }

  const Context = { Provider, symbol }

  CONTEXTS_DATA.set(Context as any, { symbol, defaultValue })

  return Context

}