
/* HELPERS */

declare const ContextWithDefaultSymbol: unique symbol;

/* MAIN */

type ArrayMaybe<T = unknown> = T[] | T;

type Callback = () => void;

type Child = null | undefined | boolean | bigint | number | string | symbol | Node | Array<Child> | (() => Child);

type ChildWithMetadata<T = unknown> = (() => Child) & { metadata: T };

type Classes = FunctionMaybe<null | undefined | string | Record<string, FunctionMaybe<null | undefined | boolean>> | (FunctionMaybe<null | undefined | boolean | string> | Classes)[]>;

type ComponentFunction<P = {}> = ( props: P ) => Child;

type ComponentIntrinsicElement = keyof JSX.IntrinsicElements;

type ComponentNode = Node;

type Component<P = {}> = ComponentFunction<P> | ComponentIntrinsicElement | ComponentNode;

type ComponentsMap = Record<string, ComponentFunction<any>>;

type Constructor<T = unknown> = { new (): T };

type ConstructorWith<T = unknown, Arguments extends unknown[] = []> = { new ( ...args: Arguments ): T };

type ContextData<T = unknown> = { symbol: symbol, defaultValue?: T };

type ContextProvider<T = unknown> = ( props: { value: T, children: Child } ) => Child;

type Context<T = unknown> = { Provider: ContextProvider<T> };

type ContextWithDefault<T = unknown> = Context<T> & { readonly [ContextWithDefaultSymbol]: true };

type DirectiveFunction<Arguments extends unknown[] = []> = ( ref: globalThis.Element, ...args: Arguments ) => void;

type DirectiveProvider = ( props: { children: Child } ) => Child;

type DirectiveRef<Arguments extends unknown[] = []> = ( ...args: Arguments ) => (( ref: globalThis.Element ) => void);

type DirectiveRegister = () => void;

type Directive<Arguments extends unknown[] = []> = { Provider: DirectiveProvider, ref: DirectiveRef<Arguments>, register: DirectiveRegister };

type DirectiveData<Arguments extends unknown[] = []> = { fn: DirectiveFunction<Arguments>, immediate: boolean };

type DirectiveOptions = { immediate?: boolean };

type Disposer = () => void;

type EffectFunction = () => Disposer | void;

type EffectOptions = import ( 'oby' ).EffectOptions;

type Element<T = Child> = () => T;

type ExtractArray<T> = Extract<T, unknown[]>;

type EventListener = ( event: Event ) => void;

type Falsy<T = unknown> = Extract<T, 0 | -0 | 0n | -0n | '' | false | null | undefined | void>;

type ForOptions = import ( 'oby' ).ForOptions;

type FN<Arguments extends unknown[], Return extends unknown = void> = ( ...args: Arguments ) => Return;

type FragmentUndefined = { placeholder?: Node, values: undefined, fragmented?: false, length: 0 };

type FragmentNode = { placeholder?: Node, values: Node, fragmented?: false, length: 1 };

type FragmentFragment = { placeholder?: Node, values: Fragment, fragmented: true, length: 1 };

type FragmentNodes = { placeholder?: Node, values: Node[], fragmented?: false, length: 2 | 3 | 4 | 5 };

type FragmentFragments = { placeholder?: Node, values: Fragment[], fragmented: true, length: 2 | 3 | 4 | 5 };

type FragmentMixed = { placeholder?: Node, values: (Node | Fragment)[], fragmented: true, length: 2 | 3 | 4 | 5 };

type Fragment = FragmentUndefined | FragmentNode | FragmentFragment | FragmentNodes | FragmentFragments | FragmentMixed;

type FunctionMaybe<T = unknown> = (() => T) | T;

type Indexed<T = unknown> = T extends ObservableReadonly<infer U> ? ObservableReadonly<U> : ObservableReadonly<T>;

type LazyComponent<P = {}> = ( props: P ) => ObservableReadonly<Child>;

type LazyFetcher<P = {}> = () => Promise<{ default: ComponentFunction<P> } | ComponentFunction<P>>;

type LazyResult<P = {}> = LazyComponent<P> & ({ preload: () => Promise<void> });

type MemoOptions<T = unknown> = import ( 'oby' ).MemoOptions<T>;

type Observable<T = unknown> = import ( 'oby' ).Observable<T>;

type ObservableLike<T = unknown> = import ( 'oby' ).ObservableLike<T>;

type ObservableReadonly<T = unknown> = import ( 'oby' ).ObservableReadonly<T>;

type ObservableReadonlyLike<T = unknown> = import ( 'oby' ).ObservableReadonlyLike<T>;

type ObservableMaybe<T = unknown> = Observable<T> | ObservableReadonly<T> | T;

type ObservableOptions<T = unknown> = import ( 'oby' ).ObservableOptions<T>;

type PromiseMaybe<T = unknown> = Promise<T> | T;

type Props = Record<string, any>;

type Ref<T = unknown> = ( value: T ) => void;

type ResourceStaticPending<T = unknown> = { pending: true, error?: never, value?: never, latest?: T };

type ResourceStaticRejected = { pending: false, error: Error, value?: never, latest?: never };

type ResourceStaticResolved<T = unknown> = { pending: false, error?: never, value: T, latest: T };

type ResourceStatic<T = unknown> = ResourceStaticPending<T> | ResourceStaticRejected | ResourceStaticResolved<T>;

type ResourceFunction<T = unknown> = { pending (): boolean, error (): Error | undefined, value (): T | undefined, latest (): T | undefined };

type Resource<T = unknown> = ObservableReadonly<ResourceStatic<T>> & ResourceFunction<T>;

type StoreOptions = import ( 'oby' ).StoreOptions;

type Styles = FunctionMaybe<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>> | (FunctionMaybe<null | undefined | number | string> | Styles)[]>;

type SuspenseCollectorData = { active: Observable<boolean>, register: ( suspense: SuspenseData ) => void, unregister: ( suspense: SuspenseData ) => void };

type SuspenseData = { active: Observable<boolean>, increment: ( nr?: number ) => void, decrement: ( nr?: number ) => void };

type TemplateActionPath = number[];

type TemplateActionProxy = ( target: Node, method: string, key?: string, targetNode?: Node ) => void;

type TemplateActionWithNodes = [Node, string, string, string?, Node?];

type TemplateActionWithPaths = [TemplateActionPath, string, string, string?, TemplateActionPath?];

type TemplateVariableProperties = string[];

type TemplateVariableData = { path: TemplateActionPath, properties: TemplateVariableProperties };

type TemplateVariablesMap = Map<TemplateActionPath, string>;

type Truthy<T = unknown> = Exclude<T, 0 | -0 | 0n | -0n | '' | false | null | undefined | void>;

/* EXPORT */

export type {ArrayMaybe, Callback, Child, ChildWithMetadata, Classes, ComponentFunction, ComponentIntrinsicElement, ComponentNode, Component, ComponentsMap, Constructor, ConstructorWith, ContextData, ContextProvider, Context, ContextWithDefault, DirectiveFunction, DirectiveProvider, DirectiveRef, DirectiveRegister, Directive, DirectiveData, DirectiveOptions, Disposer, EffectFunction, EffectOptions, Element, ExtractArray, EventListener, Falsy, ForOptions, FN, FragmentUndefined, FragmentNode, FragmentFragment, FragmentNodes, FragmentFragments, FragmentMixed, Fragment, FunctionMaybe, Indexed, LazyComponent, LazyFetcher, LazyResult, MemoOptions, Observable, ObservableLike, ObservableReadonly, ObservableReadonlyLike, ObservableMaybe, ObservableOptions, PromiseMaybe, Props, Ref, ResourceStaticPending, ResourceStaticRejected, ResourceStaticResolved, ResourceStatic, ResourceFunction, Resource, StoreOptions, Styles, SuspenseCollectorData, SuspenseData, TemplateActionPath, TemplateActionProxy, TemplateActionWithNodes, TemplateActionWithPaths, TemplateVariableProperties, TemplateVariableData, TemplateVariablesMap, Truthy};
