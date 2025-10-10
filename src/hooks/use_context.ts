/**
 * useContext Hook for Woby Framework
 * 
 * This hook provides access to context values within functional components.
 * It works with contexts created by createContext and supports both default and undefined values.
 * 
 * @module useContext
 */

import { CONTEXTS_DATA } from '../constants'
import { context } from '../soby'
import { isNil } from '../utils/lang'
import type { Context, ContextWithDefault } from '../types'
// import { webComponentMap } from '../methods/create_context'

/**
 * Accesses the current value of a context
 * 
 * This hook returns the current context value for the specified context.
 * It must be called within a functional component or a custom hook.
 * 
 * The hook will first try to get the context value from the nearest Provider component
 * above it in the tree. If there is no Provider above it, it will return the defaultValue
 * if one was provided to createContext, otherwise it returns undefined.
 * 
 * @template T - The type of the context value
 * @param Context - The context object created by createContext
 * @returns The current context value
 * 
 * @example
 * ```tsx
 * // Create a context
 * const ThemeContext = createContext('light')
 * 
 * // Use the context in a component
 * const ThemedButton = () => {
 *   const theme = useContext(ThemeContext)
 *   return <button className={`theme-${theme}`}>Click me</button>
 * }
 * 
 * // Provide a value for the context
 * const App = () => (
 *   <ThemeContext.Provider value="dark">
 *     <ThemedButton />
 *   </ThemeContext.Provider>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // Context with undefined default
 * const UserContext = createContext<User | undefined>(undefined)
 * 
 * const UserProfile = () => {
 *   const user = useContext(UserContext)
 *   if (!user) return <div>Please log in</div>
 *   return <div>Welcome, {user.name}!</div>
 * }
 * ```
 */
export function useContext<T>(Context: ContextWithDefault<T>): T
export function useContext<T>(Context: Context<T>): T | undefined
export function useContext<T>(Context: ContextWithDefault<T> | Context<T>): T | undefined {

  // First try to get context from webComponentMap (for custom elements)
  const { symbol, defaultValue } = CONTEXTS_DATA.get(Context) || { symbol: Symbol() }

  // if (webComponentMap[symbol] !== undefined) {
  //   return isNil(webComponentMap[symbol]) ? defaultValue : webComponentMap[symbol]
  // }

  // Fall back to Soby's context system (for JSX components)
  const valueContext = context(symbol)
  const value = isNil(valueContext) ? defaultValue : valueContext

  return value

}
