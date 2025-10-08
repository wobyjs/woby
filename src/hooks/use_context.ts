import { CONTEXTS_DATA } from '../constants'
import { context } from '../soby'
import { isNil } from '../utils/lang'
import type { Context, ContextWithDefault } from '../types'
// import { webComponentMap } from '../methods/create_context'

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
