
/* IMPORT */

import {SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED} from 'oby';
import type {ContextData, Context, DirectiveData} from './types';

/* MAIN */

const CONTEXTS_DATA = new WeakMap<Context<any>, ContextData<any>> ();

const DIRECTIVES: Record<symbol, DirectiveData<any>> = {};

const SYMBOL_SUSPENSE = Symbol ( 'Suspense' );

const SYMBOL_SUSPENSE_COLLECTOR = Symbol ( 'Suspense.Collector' );

const SYMBOL_TEMPLATE_ACCESSOR = Symbol ( 'Template.Accessor' );

const SYMBOLS_DIRECTIVES: Record<string, symbol> = {};

export const SYMBOL_CLONE = Symbol( 'CloneElement' );

/* EXPORT */

export {SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED, SYMBOL_UNTRACKED_UNWRAPPED};
export { CONTEXTS_DATA, DIRECTIVES, SYMBOL_SUSPENSE, SYMBOL_SUSPENSE_COLLECTOR, SYMBOL_TEMPLATE_ACCESSOR, SYMBOLS_DIRECTIVES };
