
/* IMPORT */

import { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_OBSERVABLE_WRITABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED } from 'soby'
import type { ContextData, Context, DirectiveData } from './types'

/* MAIN */

const CONTEXTS_DATA = new WeakMap<Context<any>, ContextData<any>>()

const DIRECTIVES: Record<symbol, DirectiveData<any>> = {}

const SYMBOL_SUSPENSE = Symbol('Suspense')

const SYMBOL_SUSPENSE_COLLECTOR = Symbol('Suspense.Collector')

const SYMBOL_TEMPLATE_ACCESSOR = Symbol('Template.Accessor')

const SYMBOLS_DIRECTIVES: Record<string, symbol> = {}

export const SYMBOL_CLONE = Symbol('CloneElement')

/** This symbol is indicated that the element is created through jsx/jsxDEV
 *  not customElement
 */
export const SYMBOL_JSX = Symbol('Jsx')

/* EXPORT */

export { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED, SYMBOL_OBSERVABLE_WRITABLE }
export { CONTEXTS_DATA, DIRECTIVES, SYMBOL_SUSPENSE, SYMBOL_SUSPENSE_COLLECTOR, SYMBOL_TEMPLATE_ACCESSOR, SYMBOLS_DIRECTIVES }
