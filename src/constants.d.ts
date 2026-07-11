export { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_OBSERVABLE_WRITABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED } from 'soby';
import type { ContextData, Context, DirectiveData } from './types';
export declare const CONTEXTS_DATA: WeakMap<Context<any>, ContextData<any>>;
export declare const DIRECTIVES: Record<symbol, DirectiveData<any>>;
export declare const SYMBOL_SUSPENSE: unique symbol;
export declare const SYMBOL_SUSPENSE_COLLECTOR: unique symbol;
export declare const SYMBOL_TEMPLATE_ACCESSOR: unique symbol;
export declare const SYMBOLS_DIRECTIVES: Record<string, symbol>;
export declare const SYMBOL_CLONE: unique symbol;
export declare const SYMBOL_CONTEXT: unique symbol;
export declare const SYMBOL_ISSLOT: unique symbol;
/** This symbol is indicated that the element is created through jsx/jsxDEV
 *  not customElement
 */
export declare const SYMBOL_JSX: unique symbol;
/** This symbol is used to store default props for components */
export declare const SYMBOL_DEFAULT: unique symbol;
/** Symbol to store a context-replay wrapper function on provider custom elements,
 *  so consumer custom elements can re-establish the soby context chain */
export declare const SYMBOL_CONTEXT_WRAP: unique symbol;
/** Symbol to mark a component as NOT creating shadow DOM
 *  This allows child custom elements to access context from light DOM */
export declare const SYMBOL_NO_SHADOW: unique symbol;
//# sourceMappingURL=constants.d.ts.map