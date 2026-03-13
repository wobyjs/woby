
export const isSSR = typeof window === 'undefined' || typeof document === 'undefined' || typeof customElements === 'undefined'

export { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_OBSERVABLE_WRITABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED } from 'soby'
import type { ContextData, Context, DirectiveData } from './types'

export const CONTEXTS_DATA = new WeakMap<Context<any>, ContextData<any>>()

export const DIRECTIVES: Record<symbol, DirectiveData<any>> = {}

export const SYMBOL_SUSPENSE = Symbol('Suspense')

export const SYMBOL_SUSPENSE_COLLECTOR = Symbol('Suspense.Collector')

export const SYMBOL_TEMPLATE_ACCESSOR = Symbol('Template.Accessor')

export const SYMBOLS_DIRECTIVES: Record<string, symbol> = {}

export const SYMBOL_CLONE = Symbol('CloneElement')

export const SYMBOL_CONTEXT = Symbol('IS_CONTEXT')
export const SYMBOL_ISSLOT = Symbol('IS_SLOT')

// export const SYMBOL_DOM = Symbol('DOM')

/** This symbol is indicated that the element is created through jsx/jsxDEV
 *  not customElement
 */
export const SYMBOL_JSX = Symbol('Jsx')

/** This symbol is used to store default props for components */
export const SYMBOL_DEFAULT = Symbol('Default')


export const __temp__ = Symbol('__temp__')

/** Symbol to store a context-replay wrapper function on provider custom elements,
 *  so consumer custom elements can re-establish the soby context chain */
export const SYMBOL_CONTEXT_WRAP = Symbol('CONTEXT_WRAP')
