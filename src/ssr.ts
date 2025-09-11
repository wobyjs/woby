
// /* IMPORT */
// //console.log('ssr.ts')

// export * from './jsx/jsx';
// export * from './jsx/types';
// import type { Context, Directive, DirectiveOptions, FunctionMaybe, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, Resource, StoreOptions, Component } from './types';

// /* EXPORT */

// export * from './components/index.ssr';
// // export * from './jsx/jsx-runtime.ssr'
// export * from './hooks';
// export * from './methods/index.ssr';
// export type { Context, Directive, DirectiveOptions, FunctionMaybe, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, Resource, StoreOptions, Component };
// export * from './constants';



/* EXPORT */

export * from './singleton'
// export * from './jsx/jsx';
export * from './components/index.ssr'
export * from './jsx/jsx-runtime.ssr'
export * from './hooks'
export * from './methods/index.ssr'
export * from "./constants"
export * from "./utils/index.ssr"

//export type {Context, Directive, DirectiveOptions, FunctionMaybe, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, Resource, StoreOptions, CSSProperties, Component, JSX.Element} from './types';

// export type {IComputation, IEffect, IMemo, IObservable, IObserver, IReaction, IRoot, ISuperRoot, ISuspense} from 'soby';
export type { BatchFunction, CallbackFunction, CleanupFunction, DisposeFunction, EffectFunction, ErrorFunction, EqualsFunction, /* ListenerFunction, */ MapFunction, /* MapIndexFunction, */ MapValueFunction, MemoFunction, /* ObservedFunction, ObservedDisposableFunction, ReactionFunction, */ SelectorFunction, SuspenseFunction, TryCatchFunction, UntrackFunction, UpdateFunction, WithFunction } from './soby'
export type { Observable, ObservableReadonly, ObservableOptions } from 'soby'
export { DEBUGGER, Stack, callStack } from 'soby'

import { SYMBOL_OBSERVABLE } from 'soby'

// export type {Owner} from 'soby';
export type { StoreOptions } from 'soby'
// export type {ArrayMaybe, Callable, CallableFunction, Constructor, Contexts, Frozen, FunctionMaybe, Indexed, LazyArray, LazySet, LazyValue, Mapped, PromiseMaybe, Readable, Resolvable, Resolved, Signal, Writable} from 'soby';

export type {
    ArrayMaybe, Callback, Child, ChildWithMetadata, Classes, ComponentFunction, ComponentIntrinsicElement,
    ComponentNode, Component, ComponentsMap, /* Constructor, */ ConstructorWith, ContextData, ContextProvider,
    Context, ContextWithDefault, DirectiveFunction, DirectiveProvider, DirectiveRef, DirectiveRegister, Directive, DirectiveData,
    DirectiveOptions, Disposer, Element, EventListener, Falsy, FN, FragmentUndefined, FragmentNode, FragmentFragment,
    FragmentNodes, FragmentFragments, FragmentMixed, /* Fragment, */ FunctionMaybe, MemoOptions, LazyComponent, LazyFetcher, LazyResult,
    /* Observable, ObservableReadonly, */ ObservableMaybe, /* ObservableOptions, PromiseMaybe, */ ObservableLike, Props, Ref,
    ResourceStaticPending, ResourceStaticRejected, ResourceStaticResolved, ResourceStatic, ResourceFunction, Resource,
    /* StoreOptions, */ SuspenseData, TemplateActionPath, TemplateActionProxy, TemplateActionWithNodes, TemplateActionWithPaths,
    TemplateVariableProperties, TemplateVariableData, TemplateVariablesMap, Truthy,
    CSSProperties
} from './types'

export const ObservableSymbol = SYMBOL_OBSERVABLE
export * as JSX from './types'
