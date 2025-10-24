/* EXPORT */

export * from './singleton'
// export * from './jsx/jsx';
export * from './components'
export * from './jsx/runtime'
export * from './hooks'
// Explicitly export from methods and utils to avoid assign conflict
export {
    $,
    $$,
    batch,
    context,
    createContext,
    createDirective,
    createElement,
    defaults,
    assign,
    make,
    clone,
    h,
    hmr,
    html,
    isBatching,
    isObservable,
    isObservableWritable,
    isServer,
    isStore,
    lazy,
    render,
    renderToString,
    resolve,
    store,
    template,
    tick,
    untrack,
    cloneElement,
    setRef,
    customElement,
    wrapCloneElement,
} from './methods'
export type {
    ElementAttributes,
    CustomElementChildren,
    StyleEncapsulationProps,
} from './methods'
export {
    castArray,
    castError,
    flatten,
    indexOf,
    isArray,
    isBoolean,
    isComponent,
    isError,
    isFalsy,
    isFunction,
    isClass,
    isFunctionReactive,
    isNil,
    isNode,
    isObject,
    isPrimitive,
    isPromise,
    isString,
    isSVG,
    isSVGElement,
    isTemplateAccessor,
    isTruthy,
    isVoidChild,
    mark,
    noop,
    once,
    fixBigInt,
    toArray,
    setProp,
    resolveArraysAndStatics
} from './utils'
export * from "./constants"

//export type {Context, Directive, DirectiveOptions, FunctionMaybe, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, Resource, StoreOptions, CSSProperties, Component, JSX.Element} from './types';

// export type {IComputation, IEffect, IMemo, IObservable, IObserver, IReaction, IRoot, ISuperRoot, ISuspense} from 'soby';
export type { BatchFunction, CallbackFunction, CleanupFunction, DisposeFunction, EffectFunction, ErrorFunction, EqualsFunction, /* ListenerFunction, */ MapFunction, /* MapIndexFunction, */ MapValueFunction, MemoFunction, /* ObservedFunction, ObservedDisposableFunction, ReactionFunction, */ SelectorFunction, SuspenseFunction, TryCatchFunction, UntrackFunction, UpdateFunction, WithFunction } from './soby'
export type { Observable, ObservableReadonly, ObservableOptions } from 'soby'
export { DEBUGGER, Stack, callStack } from 'soby'
export type { CSSUnit, CSSLength } from 'soby'

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
    /* Observable, ObservableReadonly, */ ObservableMaybe, /* ObservableOptions, */ PromiseMaybe, ObservableLike, Props, Ref,
    ResourceStaticPending, ResourceStaticRejected, ResourceStaticResolved, ResourceStatic, ResourceFunction, Resource,
    /* StoreOptions, */ SuspenseData, TemplateActionPath, TemplateActionProxy, TemplateActionWithNodes, TemplateActionWithPaths,
    TemplateVariableProperties, TemplateVariableData, TemplateVariablesMap, Truthy,
    CSSProperties, Nullable, Unobservant, Observant,
} from './types'

export const ObservableSymbol = SYMBOL_OBSERVABLE
export * as JSX from './types'

// Add HtmlBoolean export
export { HtmlBoolean, HtmlNumber, HtmlDate, HtmlBigInt, HtmlObject, HtmlLength, HtmlBox, HtmlColor } from 'soby'
