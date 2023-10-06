import type * as CSS from 'csstype'
declare const ContextWithDefaultSymbol: unique symbol
type ArrayMaybe<T = unknown> = T[] | T
type Callback = () => void
type Child = null | undefined | boolean | bigint | number | string | symbol | Node | Array<Child> | (() => Child)
type ChildWithMetadata<T = unknown> = (() => Child) & {
    metadata: T
}
type Classes = FunctionMaybe<null | undefined | string | Record<string, FunctionMaybe<null | undefined | boolean>> | (FunctionMaybe<null | undefined | boolean | string> | Classes)[]>
type ComponentFunction<P extends Props = {}> = (props: P) => Child
type ComponentClass<P = {}> = new (props: P) => Child
type ComponentIntrinsicElement = keyof JSX.IntrinsicElements
type ComponentNode = Node
type Component<P extends Props = {}> = ComponentFunction<P> | ComponentIntrinsicElement | ComponentClass
type ComponentsMap = Record<string, ComponentFunction<any>>
type Constructor<T = unknown> = {
    new(): T
}
type ConstructorWith<T = unknown, Arguments extends unknown[] = []> = {
    new(...args: Arguments): T
}
type ContextData<T = unknown> = {
    symbol: symbol
    defaultValue?: T
}
type ContextProvider<T = unknown> = (props: {
    value: ObservableMaybe<T>
    children: Child
}) => Child
type ContextRegister<T = unknown> = (value: T) => void
type Context<T = unknown> = {
    Provider: ContextProvider<T>
    register: ContextRegister<T>
}
type ContextWithDefault<T = unknown> = Context<T> & {
    readonly [ContextWithDefaultSymbol]: true
}
type DirectiveFunction<Arguments extends unknown[] = []> = (ref: globalThis.Element, ...args: Arguments) => void
type DirectiveProvider = (props: {
    children: Child
}) => Child
type DirectiveRef<Arguments extends unknown[] = []> = (...args: Arguments) => ((ref: globalThis.Element) => void)
type DirectiveRegister = () => void
type Directive<Arguments extends unknown[] = []> = {
    Provider: DirectiveProvider
    ref: DirectiveRef<Arguments>
    register: DirectiveRegister
}
type DirectiveData<Arguments extends unknown[] = []> = {
    fn: DirectiveFunction<Arguments>
    immediate: boolean
}
type DirectiveOptions = {
    immediate?: boolean
}
type Disposer = () => void
type Element<T = Child> = () => T
type EventListener = (event: Event) => void
type Falsy<T = unknown> = Extract<T, 0 | -0 | 0n | -0n | '' | false | null | undefined | void>
type FN<Arguments extends unknown[], Return extends unknown = void> = (...args: Arguments) => Return
type FragmentUndefined = {
    values: undefined
    fragmented?: false
    length: 0
}
type FragmentNode = {
    values: Node
    fragmented?: false
    length: 1
}
type FragmentFragment = {
    values: Fragment
    fragmented: true
    length: 1
}
type FragmentNodes = {
    values: Node[]
    fragmented?: false
    length: 2 | 3 | 4 | 5
}
type FragmentFragments = {
    values: Fragment[]
    fragmented: true
    length: 2 | 3 | 4 | 5
}
type FragmentMixed = {
    values: (Node | Fragment)[]
    fragmented: true
    length: 2 | 3 | 4 | 5
}
type Fragment = FragmentUndefined | FragmentNode | FragmentFragment | FragmentNodes | FragmentFragments | FragmentMixed
type FunctionMaybe<T = unknown> = (() => T) | T
type LazyComponent<P = {}> = (props: P) => ObservableReadonly<Child>
type LazyFetcher<P extends Props = {}> = () => Promise<{
    default: ComponentFunction<P>
} | ComponentFunction<P>>
type LazyResult<P = {}> = LazyComponent<P> & ({
    preload: () => Promise<void>
})
type Observable<T = unknown> = import('oby').Observable<T>
type ObservableReadonly<T = unknown> = import('oby').ObservableReadonly<T>
type ObservableMaybe<T = unknown> = Observable<T> | ObservableReadonly<T> | T
type ObservableOptions<T = unknown> = import('oby').ObservableOptions<T>
type PromiseMaybe<T = unknown> = Promise<T> | T
type Props = Record<string, any>
type Ref<T = unknown> = (value: T) => void
type ResourceStaticPending<T = unknown> = {
    pending: true
    error?: never
    value?: any
    latest?: T
}
type ResourceStaticRejected = {
    pending: false
    error: Error
    value?: never
    latest?: never
}
type ResourceStaticResolved<T = unknown> = {
    pending: false
    error?: never
    value: T
    latest: T
}
type ResourceStatic<T = unknown> = ResourceStaticPending<T> | ResourceStaticRejected | ResourceStaticResolved<T>
type ResourceFunction<T = unknown> = {
    pending(): boolean
    error(): Error | undefined
    value(): T | undefined
    latest(): T | undefined
}
type Resource<T = unknown> = ObservableReadonly<ResourceStatic<T>> & ResourceFunction<T>
type StoreOptions = import('oby').StoreOptions
type SuspenseData = {
    active: Observable<boolean>
    increment: (nr?: number) => void
    decrement: (nr?: number) => void
}
type TemplateActionPath = number[]
type TemplateActionProxy = (target: Node, method: string, key?: string, targetNode?: Node) => void
type TemplateActionWithNodes = [Node, string, string, string?, Node?]
type TemplateActionWithPaths = [TemplateActionPath, string, string, string?, TemplateActionPath?]
type TemplateVariableProperties = string[]
type TemplateVariableData = {
    path: TemplateActionPath
    properties: TemplateVariableProperties
}
type TemplateVariablesMap = Map<TemplateActionPath, string>
type Truthy<T = unknown> = Exclude<T, 0 | -0 | 0n | -0n | '' | false | null | undefined | void>
export type CSSProperties = {
    [K in keyof CSS.Properties<string | number>]: FunctionMaybe<CSS.Properties<string | number>[K]>
}
export type { ArrayMaybe, Callback, Child, ChildWithMetadata, Classes, ComponentFunction, ComponentIntrinsicElement, ComponentNode, Component, ComponentsMap, Constructor, ConstructorWith, ContextData, ContextProvider, ContextRegister, Context, ContextWithDefault, DirectiveFunction, DirectiveProvider, DirectiveRef, DirectiveRegister, Directive, DirectiveData, DirectiveOptions, Disposer, Element, EventListener, Falsy, FN, FragmentUndefined, FragmentNode, FragmentFragment, FragmentNodes, FragmentFragments, FragmentMixed, Fragment, FunctionMaybe, LazyComponent, LazyFetcher, LazyResult, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, PromiseMaybe, Props, Ref, ResourceStaticPending, ResourceStaticRejected, ResourceStaticResolved, ResourceStatic, ResourceFunction, Resource, StoreOptions, SuspenseData, TemplateActionPath, TemplateActionProxy, TemplateActionWithNodes, TemplateActionWithPaths, TemplateVariableProperties, TemplateVariableData, TemplateVariablesMap, Truthy }
