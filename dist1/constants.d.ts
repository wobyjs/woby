import { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_UNCACHED, SYMBOL_UNTRACKED_UNWRAPPED } from './oby';
import type { ContextData, Context } from './types';
declare const CONTEXTS_DATA: WeakMap<Context<any>, ContextData<any>>;
declare const DIRECTIVE_OUTSIDE_SUPER_ROOT: {
    current: boolean;
};
declare const HMR: boolean;
declare const SYMBOL_SUSPENSE: unique symbol;
declare const SYMBOL_TEMPLATE_ACCESSOR: unique symbol;
declare const SYMBOLS_DIRECTIVES: Record<string, symbol>;
export declare const SYMBOL_CLONE: unique symbol;
export { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_UNCACHED, SYMBOL_UNTRACKED_UNWRAPPED };
export { CONTEXTS_DATA, DIRECTIVE_OUTSIDE_SUPER_ROOT, HMR, SYMBOL_SUSPENSE, SYMBOL_TEMPLATE_ACCESSOR, SYMBOLS_DIRECTIVES };
