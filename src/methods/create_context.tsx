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
