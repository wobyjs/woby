
<p align="center">
  <a href="https://github.com/wongchichong/woby">
    <img src="./resources/banner/png/banner-light-rounded.png" alt="Woby's Banne" width="640px" height="320px">
  </a>
</p>

# Woby

A high-performance framework with fine-grained observable-based reactivity for building rich applications. Woby is built upon the [Voby](https://github.com/vobyjs/voby) reactive core, providing an enhanced API for component-based development.

## Features

This works similarly to [Solid](https://www.solidjs.com), but without a custom Babel transform and with a different API.

- **No VDOM**: there's no VDOM overhead, the framework deals with raw DOM nodes directly.
- **No stale closures**: functions are always executed afresh, no need to worry about previous potential executions of the current function, ever.
- **No rules of hooks**: hooks are regular functions that can be nested indefinitely, called conditionally, and used outside components, providing maximum flexibility for developers.
- **No dependencies arrays**: the framework is able to detect what depends on what else automatically, no need to specify dependencies manually.
- **No props diffing**: updates are fine grained, there's no props diffing, whenever an attribute/property/class/handler/etc. should be updated it's updated directly and immediately.
- **No key prop**: developers can map over arrays directly or use the `For` component with an array of unique values, eliminating the need to specify keys explicitly.
- **No Babel**: this framework works with plain JavaScript (plus JSX support), eliminating the need for Babel transforms. As a result, there are zero transform function bugs since no code transformation is required.
- **No magic**: Woby follows a transparent approach where your code behaves exactly as written, with no hidden transformations or unexpected behavior.
- **Client-focused**: this framework is currently focused on client-side rich applications. Server-related features such as hydration, server components, SSR, and streaming are not implemented at this time.
- **Observable-based**: observables are at the core of the reactivity system. While the approach differs significantly from React-like systems and may require an initial learning investment, it provides substantial benefits in terms of performance and developer experience.
- **Minimal dependencies**: Woby is designed with a focus on minimal third-party dependencies, providing a streamlined API for developers who prefer a lightweight solution. The framework draws inspiration from [Solid](https://www.solidjs.com) while offering its own unique approach to reactive programming.
- **Built-in Class Management**: Woby includes powerful built-in class management that supports complex class expressions similar to `classnames` and `clsx` libraries, with full reactive observable support.

## 📚 Documentation

**[📖 Complete Documentation Wiki](./docs/README.md)** - Comprehensive guides, tutorials, and API reference

### Quick Links
- **[Installation Guide](./docs/Installation.md)** - Get started with Woby
- **[Quick Start Tutorial](./docs/Quick-Start.md)** - Build your first app
- **[API Reference](./docs/Core-Methods.md)** - Complete API documentation
- **[Examples Gallery](./docs/Examples.md)** - Practical examples and patterns
- **[Class Management](./docs/Class-Management.md)** - Advanced class handling with reactive support
- **[Best Practices](./docs/Best-Practices.md)** - Recommended patterns and practices
- **[Woby vs React](./docs/Woby-vs-React.md)** - API differences and migration guide
- **[FAQ](./docs/FAQ.md)** - Common questions and answers

## Demos

You can find some demos and benchmarks below, more demos are contained inside the repository.

- Playground: https://codesandbox.io/s/woby-playground-7w2pxg
- Benchmark: https://krausest.github.io/js-framework-benchmark/current.html
- Counter: https://codesandbox.io/s/woby-demo-counter-23fv5
- Clock: https://codesandbox.io/s/woby-demo-clock-w1e7yb
- Emoji Counter: https://codesandbox.io/s/woby-demo-emoji-counter-j91iz2
- HyperScript: https://codesandbox.io/s/woby-demo-hyperscript-h4rf38
- HTML Template Literal: https://codesandbox.io/s/woby-demo-html-lvfeyo
- Single-file HTML: https://codesandbox.io/s/woby-demo-html-dueygt?file=/public/index.html
- Spiral: https://codesandbox.io/s/woby-demo-spiral-ux33p6
- Store Counter: https://codesandbox.io/s/woby-demo-store-counter-kvoqrw
- Triangle: https://codesandbox.io/s/woby-demo-triangle-l837v0
- Boxes: https://codesandbox.io/s/woby-demo-boxes-wx6rqb

## APIs

| Core Methods                        | Components                | Hooks                             | Types & Utilities                  | Miscellaneous            |
|------------------------------------|---------------------------|-----------------------------------|------------------------------------|--------------------------|
| [`$`](#methods)                    | [`Dynamic`](#dynamic)     | [`useAbortController`](#useabortcontroller) | [`Context`](#context)             | [`Contributing`](#contributing) |
| [`batch`](#batch)                  | [`ErrorBoundary`](#errorboundary) | [`useAbortSignal`](#useabortsignal) | [`Directive`](#directive)         | [`Globals`](#globals)   |
| [`createContext`](#createcontext) | [`For`](#for)             | [`useAnimationFrame`](#useanimationframe) | [`DirectiveOptions`](#directiveoptions) | [`JSX`](#jsx)           |
| [`createDirective`](#createdirective) | [`ForIndex`](#forindex) | [`useAnimationLoop`](#useanimationloop) | [`FunctionMaybe`](#functionmaybe) | [`Tree Shaking`](#tree-shaking) |
| [`customElement`](#customelement) | [`ForValue`](#forvalue)   | [`useBoolean`](#useboolean)       | [`Observable`](#observable)       | [`TypeScript`](#typescript) |
| [`createElement`](#createelement) | [`Fragment`](#fragment)   | [`useCleanup`](#usecleanup)       | [`ObservableReadonly`](#observablereadonly) |                          |
| [`h`](#h)                          | [`If`](#if)               | [`useContext`](#usecontext)       | [`ObservableMaybe`](#observablemaybe) |                          |
| [`html`](#html)                    | [`Portal`](#portal)       | [`useDisposed`](#usedisposed)     | [`ObservableOptions`](#observableoptions) |                          |
| [`isBatching`](#isbatching)       | [`Suspense`](#suspense)   | [`useEffect`](#useeffect)         | [`Resource`](#resource)           |                          |
| [`isObservable`](#isobservable)   | [`Switch`](#switch)       | [`useError`](#useerror)           | [`StoreOptions`](#storeoptions)   |                          |
| [`isServer`](#isserver)           | [`Ternary`](#ternary)     | [`useEventListener`](#useeventlistener) |                                |                          |
| [`isStore`](#isstore)             |                           | [`useFetch`](#usefetch)           |                                    |                          |
| [`lazy`](#lazy)                   |                           | [`useIdleCallback`](#useidlecallback) |                                |                          |
| [`render`](#render)               |                           | [`useIdleLoop`](#useidleloop)     |                                    |                          |
| [`renderToString`](#rendertostring) |                         | [`useInterval`](#useinterval)     |                                    |                          |
| [`resolve`](#resolve)             |                           | [`useMemo`](#usememo)             |                                    |                          |
| [`store`](#store)                 |                           | [`useMicrotask`](#usemicrotask)   |                                    |                          |
| [`template`](#template)           |                           | [`usePromise`](#usepromise)       |                                    |                          |
| [`untrack`](#untrack)             |                           | [`useReaction`](#usereaction)     |                                    |                          |
|                                    |                           | [`useReadonly`](#usereadonly)     |                                    |                          |
|                                    |                           | [`useResolved`](#useresolved)     |                                    |                          |
|                                    |                           | [`useResource`](#useresource)     |                                    |                          |
|                                    |                           | [`useRoot`](#useroot)             |                                    |                          |
|                                    |                           | [`useSelector`](#useselector)     |                                    |                          |
|                                    |                           | [`useTimeout`](#usetimeout)       |                                    |                          |
## Usage

Woby serves as a view layer built on top of the Observable library [`soby`](https://github.com/wongchichong/soby). Understanding how soby works is essential for effectively using Woby.

Woby re-exports all soby functionality with interfaces adjusted for component and hook usage, along with additional framework-specific functions.

### Counter Example

Here's a complete counter example that demonstrates Woby's reactive capabilities:

**Source:** [woby-demo](https://github.com/wongchichong/woby-demo) ⭐

``tsx
import { $, $$, useMemo, render, Observable, customElement, ElementAttributes } from 'woby'

const Counter = ({ increment, decrement, value, ...props }: { 
  increment: () => number, 
  decrement: () => number, 
  value: Observable<number> 
}): JSX.Element => {
  const v = $('abc')
  const m = useMemo(() => {
    return $$(value) + $$(v)
  })
  return <div {...props}>
    <h1>Counter</h1>
    <p>{value}</p>
    <p>{m}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
}

// Register as custom element
customElement('counter-element', ['value', 'class'], Counter)

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}


const App = () => {
  const value = $(0)
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)

  return <counter-element 
    value={value} 
    increment={increment} 
    decrement={decrement} 
    class="border-2 border-black border-solid bg-amber-400" 
  />
}

render(<App />, document.getElementById('app'))
```

**Output:**
```
<counter-element value="0" class="border-2 border-black border-solid bg-amber-400">
  <div class="border-2 border-black border-solid bg-amber-400">
    <h1>Counter</h1>
    <p>0</p>
    <p>0abc</p>
    <button>+</button>
    <button>-</button>
  </div>
</counter-element>
```

Modifying the value attribute on <counter-element value="0> triggers an immediate update to its associated observable.

### Advanced Class Management

Woby provides powerful built-in class management that supports complex class expressions with full reactive observable support, similar to popular libraries like `classnames` and `clsx`.

#### Class Array Support

Woby supports complex class expressions including arrays, objects, and functions:

``tsx
// Array of classes
<div class={['red', 'bold']}>Text</div>

// Nested arrays
<div class={['red', ['bold', ['italic']]]}>Text</div>

// Mixed types
<div class={[
  "red",
  () => ($$(value) % 2 === 0 ? "bold" : ""),
  { hidden: true, italic: false },
  ['hello', ['world']]
]}>Complex classes</div>
```

#### Reactive Classes

All class expressions support reactive observables that automatically update when values change:

``tsx
const isActive = $(false)
const theme = $('dark')

// Reactive boolean
<div class={{ active: isActive }}>Toggle me</div>

// Reactive string
<div class={() => `btn btn-${theme()}`}>Themed button</div>

// Complex reactive expression
<div class={[
  'base-class',
  () => isActive() ? 'active' : 'inactive',
  { 'loading': loadingState() }
]}>Dynamic element</div>
```

#### Class Object Syntax

Woby supports object syntax for conditional classes where keys are class names and values are boolean conditions:

``tsx
const error = $(false)
const warning = $(false)

<div class={{
  'base': true,           // Always applied
  'error': error,         // Applied when error is truthy
  'warning': warning,     // Applied when warning is truthy
  'success': !error && !warning  // Applied when neither error nor warning
}}>Status element</div>
```

#### Function-based Classes

Classes can be computed using functions that return class strings or other class expressions:

``tsx
const count = $(0)

<div class={() => count() > 5 ? 'high-count' : 'low-count'}>
  Count: {count}
</div>

// Function returning complex expression
<div class={() => [
  'base',
  count() > 10 ? 'large' : 'small',
  { 'even': count() % 2 === 0 }
]}>
  Dynamic element
</div>
```

### Built-in Classnames/CLSX/Tailwind-Merge Support

Woby's class system provides built-in functionality equivalent to popular libraries:

- **Classnames/CLSX-like syntax**: Supports all the same patterns as the popular `classnames` and `clsx` libraries
- **Tailwind CSS ready**: Works seamlessly with Tailwind CSS class patterns
- **No external dependencies**: Built-in implementation eliminates the need for external libraries
- **Reactive by default**: All class expressions automatically update when observables change
- **Performance optimized**: Efficient implementation that minimizes DOM updates

#### Migration from CLSX

If you're familiar with `clsx`, Woby's class system works similarly:

``tsx
// Instead of: clsx('foo', true && 'bar', 'baz')
<div class={['foo', true && 'bar', 'baz']}>Content</div>

// Instead of: clsx({ foo:true, bar:false, baz:isTrue() })
<div class={{ foo:true, bar:false, baz:isTrue() }}>Content</div>

// Instead of: clsx(['foo', 0, false, 'bar'])
<div class={['foo', 0, false, 'bar']}>Content</div>
```

#### Integration with Tailwind Merge

For advanced Tailwind CSS class merging, you can wrap your expressions with a custom merge function:

``tsx
import { twMerge } from 'tailwind-merge'

const mergedClass = useMemo(() => twMerge(
  'px-4 py-2 bg-blue-500',
  isActive() ? 'bg-blue-700' : 'bg-blue-500'
))

<div class={mergedClass}>Merged classes</div>
```

All reactive elements in class expressions should be wrapped in `useMemo` or arrow functions `() =>` to ensure proper reactivity:

``tsx
// Correct - wrapped in useMemo
const dynamicClass = useMemo(() => ({
  'active': isActive(),
  'disabled': isDisabled()
}))

<div class={dynamicClass}>Content</div>

// Correct - wrapped in arrow function
<div class={() => isActive() ? 'active' : 'inactive'}>Content</div>

// Correct - observables automatically handled
<div class={{ 'active': isActive }}>Content</div>
```

### Methods

The following top-level functions are provided.

#### `

This function is just the default export of `soby`, it can be used to wrap a value in an observable.

No additional methods are attached to this function. Everything that `soby` attaches to it is instead exported as components and hooks.

[Read upstream documentation](https://github.com/wongchichong/soby#core).

Interface:

```ts
function $ <T> (): Observable<T | undefined>;
function $ <T> ( value: undefined, options?: ObservableOptions<T | undefined> ): Observable<T | undefined>;
function $ <T> ( value: T, options?: ObservableOptions<T> ): Observable<T>;
```

Usage:

```tsx
import {$} from 'woby';

// Create an observable without an initial value

$<number> ();

// Create an observable with an initial value

$(1);

// Create an observable with an initial value and a custom equality function

const equals = ( value, valuePrev ) => Object.is ( value, valuePrev );

const o = $( 1, { equals } );

// Create an observable with an initial value and a special "false" equality function, which is a shorthand for `() => false`, which causes the observable to always emit when its setter is called

const oFalse = $( 1, { equals: false } );

// Getter

o (); // => 1

// Setter

o ( 2 ); // => 2

// Setter via a function, which gets called with the current value

o ( value => value + 1 ); // => 3

// Setter that sets a function, it has to be wrapped in another function because the above form exists

const noop = () => {};

o ( () => noop );
```

#### `$`

This function unwraps a potentially observable value.

[Read upstream documentation](https://github.com/wongchichong/soby#get).

Interface:

```ts
function $ <T> ( value: T ): (T extends ObservableReadonly<infer U> ? U : T);
```

Usage:

```tsx
import {$} from 'woby';

// Getting the value out of an observable

const o = $(123);

$ ( o ); // => 123

// Getting the value out of a function

$ ( () => 123 ); // => 123

// Getting the value out of an observable but not out of a function

$ ( o, false ); // => 123
$ ( () => 123, false ); // => () => 123

// Getting the value out of a non-observable and non-function

$ ( 123 ); // => 123
```

#### `batch`

This function holds onto updates within its scope and flushes them out once it exits.

[Read upstream documentation](https://github.com/wongchichong/soby#batch).

Interface:

```ts
function batch <T> ( fn: () => T ): T;
function batch <T> ( value: T ): T;
```

Usage:

```tsx
import {batch} from 'woby';

batch // => Same as require ( 'soby' ).batch
```

#### `createContext`

This function creates a context object, optionally with a default value, which can later be used to provide a new value for the context or to read the current value.

A context's `Provider` will register the context with its children, which is always what you want, but it can lead to messy code due to nesting.

A context's `register` function will register the context with the current parent observer, which is usually only safe to do at the root level, but it will lead to very readable code.

Interface:

```ts
type ContextProvider<T> = ( props: { value: T, children: JSX.Element } ) => JSX.Element;
type ContextRegister<T> = ( value: T ) => void;
type Context<T> = { Provider: ContextProvider<T>, register: ContextRegister<T> };

function createContext <T> ( defaultValue?: T ): Context<T>;
```

Usage:

```tsx
import {createContext, useContext} from 'woby';

const App = () => {
  const Context = createContext ( 123 );
  return (
    <>
      {() => {
        const value = useContext ( Context );
        return <p>{value}</p>;
      }}
      <Context.Provider value={312}>
        {() => {
          const value = useContext ( Context );
          return <p>{value}</p>;
        }}
      </Context.Provider>
    </>
  );
};
```

#### `createDirective`

This function creates a directive provider, which can be used to register a directive with its children.

A directive is a function that always receives an `Element` as its first argument, which is basically a ref to the target element, and arbitrary user-provided arguments after that.

Each directive has a unique name and it can be called by simply writing `use:directivename={[arg1, arg2, ...argN]]}` in the JSX.

Directives internally are registered using context providers, so you can also override directives for a particular scope just by registering another directive with the same name closer to where you are reading it.

A directive's `Provider` will register the directive with its children, which is always what you want, but it can lead to messy code due to nesting.

A directive's `register` function will register the directive with the current parent observer, which is usually only safe to do at the root level, but it will lead to very readable code.

Interface:

```ts
type DirectiveFunction = <T extends unknown[]> ( ref: Element, ...args: T ) => void;
type DirectiveProvider = ( props: { children: JSX.Element } ) => JSX.Element;
type DirectiveRef<T extends unknown[]> = ( ...args: T ) => (( ref: Element ) => void);
type DirectiveRegister = () => void;
type Directive = { Provider: DirectiveProvider, ref: DirectiveRef, register: DirectiveRegister };

function createDirective <T extends unknown[] = []> ( name: string, fn: DirectiveFunction<T>, options?: DirectiveOptions ): Directive;
```

Usage:

```tsx
import {createDirective, useEffect} from 'woby';

// First of all if you are using TypeScript you should extend the "JSX.Directives" interface, so that TypeScript will know about your new directive

namespace JSX {
  interface Directives {
    tooltip: [title: string] // Mapping the name of the directive to the array of arguments it accepts
  }
}

// Then you should create a directive provider

const TooltipDirective = createDirective ( 'tooltip', ( ref, title: string ) => {

  useEffect ( () => {

    if ( !ref () ) return; // The element may not be available yet, or it might have been unmounted

    // Code that implements a tooltip for the given element here...

  });

});

// Then you can use the new "tooltip" directive anywhere inside the "TooltipDirective.Provider"

const App = () => {
  return (
    <TooltipDirective.Provider>
      <input value="Placeholder..." use:tooltip={['This is a tooltip!']} />
    </TooltipDirective.Provider>
  );
};

// You can also use directives directly by padding them along as refs

const App = () => {
  return <input ref={TooltipDirective.ref ( 'This is a tooltip!' )} value="Placeholder..." />;
};
```

#### `createElement`

This is the internal function that will make DOM nodes and call/instantiate components, it will be called for you automatically via JSX.

Interface:

```ts
function createElement <P = {}> ( component: JSX.Component<P>, props: P | null, ...children: JSX.Element[] ): () => JSX.Element);
```

Usage:

```tsx
import {createElement} from 'woby';

const element = createElement ( 'div', { class: 'foo' }, 'child' ); // => () => HTMLDivElement
```

#### `h`

This function is just an alias for the `createElement` function, it's more convenient to use if you want to use Woby in hyperscript mode just because it has a much shorter name.

Interface:

```ts
function h <P = {}> ( component: JSX.Component<P>, props: P | null, ...children: JSX.Element[] ): () => JSX.Element);
```

Usage:

```tsx
import {h} from 'woby';

const element = h ( 'div', { class: 'foo' }, 'child' ); // => () => HTMLDivElement
```

#### `html`

This function provides an alternative way to use the framework, without writing JSX or using the `h` function manually, it instead allows you to write your markup as tagged template literals.

[`htm`](https://github.com/developit/htm) is used under the hood, read its documentation.

Interface:

```ts
function html ( strings: TemplateStringsArray, ...values: any[] ): JSX.Element;
```

Usage:

```tsx
import {html, If} from 'woby';

const Counter = (): JSX.Element => {
  const value = $(0);
  const increment = () => value ( prev => prev + 1 );
  const decrement = () => value ( prev => prev - 1 );
  return html`
    <h1>Counter</h1>
    <p>${value}</p>
    <button onClick=${increment}>+</button>
    <button onClick=${decrement}>-</button>
  `;
};

// Using a custom component without registering it

const NoRegistration = (): JSX.Element => {
  return html`
    <${If} when=${true}>
      <p>content</p>
    </${If}>
  `;
};

// Using a custom component after registering it, so you won't need to interpolate it anymore

html.register ({ If });

const NoRegistration = (): JSX.Element => {
  return html`
    <If when=${true}>
      <p>content</p>
    </If>
  `;
};
```

#### `isBatching`

This function tells you if batching is currently active or not.

Interface:

```ts
function isBatching (): boolean;
```

Usage:

```tsx
import {batch, isBatching} from 'woby';

// Checking if currently batching

isBatching (); // => false

batch ( () => {

  isBatching (); // => true

});

isBatching (); // => false
```

#### `isObservable`

This function tells you if a variable is an observable or not.

Interface:

```ts
function isObservable <T = unknown> ( value: unknown ): value is Observable<T> | ObservableReadonly<T>;
```

Usage:

```tsx
import {$, isObservable} from 'woby';

isObservable ( 123 ); // => false
isObservable ( $(123) ); // => true
```

#### `isServer`

This function tells you if your code is executing in a browser environment or not.

Interface:

```ts
function isServer (): boolean;
```

Usage:

```tsx
import {isServer} from 'woby';

isServer (); // => true or false
```

#### `isStore`

This function tells you if a variable is a store or not.

Interface:

```ts
function isStore ( value: unknown ): boolean;
```

Usage:

```tsx
import {store, isStore} from 'woby';

isStore ( {} ); // => false
isStore ( store ( {} ) ); // => true
```

#### `lazy`

This function creates a lazy component, which is loaded via the provided function only when/if needed.

This function uses `useResource` internally, so it's significant for `Suspense` too.

Interface:

```ts
type LazyComponent<P = {}> = ( props: P ) => ObservableReadonly<Child>;
type LazyFetcher<P = {}> = () => Promise<{ default: JSX.Component<P> } | JSX.Component<P>>;
type LazyResult<P = {}> = LazyComponent<P> & ({ preload: () => Promise<void> });

function lazy <P = {}> ( fetcher: LazyFetcher<P> ): LazyResult<P>;
```

Usage:

``ts
import {lazy} from 'woby';

const LazyComponent = lazy ( () => import ( './component' ) );
```

#### `render`

This function mounts a component inside a provided DOM element and returns a disposer function for unmounting it and stopping all reactivity inside it.

Interface:

```ts
function render ( child: JSX.Element, parent?: HTMLElement | null ): Disposer;
```

Usage:

```tsx
import {render} from 'woby';

const App = () => <p>Hello, World!</p>;

const dispose = render ( <App />, document.body );

dispose (); // Unmounted and all reactivity inside it stopped
```

#### `renderToString`

This function operates similarly to `render`, but returns a Promise that resolves to the HTML representation of the rendered component.

The current implementation works within browser-like environments. For server-side usage, [JSDOM](https://github.com/jsdom/jsdom) or similar solutions are required.

This function automatically waits for all `Suspense` boundaries to resolve before returning the HTML.

Interface:

```ts
function renderToString ( child: JSX.Element ): Promise<string>;
```

Usage:

```tsx
import {renderToString} from 'woby';

const App = () => <p>Hello, World!</p>;

const html = await renderToString ( <App /> );
```

#### `resolve`

This function resolves all reactivity within the provided argument, replacing each function with a memo that captures the function's value.

While developers may not need to use this function directly, it is internally necessary to ensure proper tracking of child values by their parent computations.

[Read upstream documentation](https://github.com/wongchichong/soby#resolve).

Interface:

```ts
type ResolvablePrimitive = null | undefined | boolean | number | bigint | string | symbol;
type ResolvableArray = Resolvable[];
type ResolvableObject = { [Key in string | number | symbol]?: Resolvable };
type ResolvableFunction = () => Resolvable;
type Resolvable = ResolvablePrimitive | ResolvableObject | ResolvableArray | ResolvableFunction;

function resolve <T> ( value: T ): T extends Resolvable ? T : never;
```

Usage:

```tsx
import {resolve} from 'woby';

resolve // => Same as require ( 'soby' ).resolve
```

#### `store`

This function returns a deeply reactive version of the passed object, where property accesses and writes are automatically interpreted as Observables reads and writes for you.

[Read upstream documentation](https://github.com/wongchichong/soby#store).

Interface:

```ts
function store <T> ( value: T, options?: StoreOptions ): T;
```

Usage:

```tsx
import {store} from 'woby';

store // => Same as require ( 'soby' ).store
```

#### `template`

This function enables constructing elements with [Solid](https://www.solidjs.com)-level performance without using the Babel transform, but also without the convenience of that.

This function works similarly to [sinuous](https://github.com/luwes/sinuous/tree/master)'s template function but provides a cleaner API, as props are accessed identically inside and outside the template.

This function can be used to wrap components that do not directly create observables or call hooks, significantly improving performance during component instantiation.

Interface:

```ts
function template <P = {}> ( fn: (( props: P ) => JSX.Element) ): (( props: P ) => () => Element);
```

Usage:

```tsx
import {template} from 'woby';

const Row = template ( ({ id, cls, label, onSelect, onRemove }) => { // Now Row is super fast to instantiate
  return (
    <tr class={cls}>
      <td class="col-md-1">{id}</td>
      <td class="col-md-4">
        <a onClick={onSelect}>{label}</a>
      </td>
      <td class="col-md-1">
        <a onClick={onRemove}>
          <span class="glyphicon glyphicon-remove" ariaHidden={true}></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  );
});

const Table = () => {
  const rows = [ /* props for all your rows here */ ];
  return rows.map ( row => <Row {...row}> );
};
```

#### `untrack`

This function executes the provided function without creating dependencies on observables retrieved inside it.

[Read upstream documentation](https://github.com/wongchichong/soby#untrack).

Interface:

```ts
function untrack <T> ( fn: () => T ): T;
function untrack <T> ( value: T ): T;
```

Usage:

```tsx
import {untrack} from 'woby';

untrack // => Same as require ( 'soby' ).untrack
```

### Components

The following components are provided.

Crucially some components are provided for control flow, since regular JavaScript control flow primitives are not reactive, and we need to have reactive alternatives to them to have great performance.

#### `Dynamic`

This component is just an alternative to `createElement` that can be used in JSX, it's useful to create a new element dynamically.

Interface:

```ts
function Dynamic <P = {}> ( props: { component: ObservableMaybe<JSX.Component<P>, props?: FunctionMaybe<P | null>, children?: JSX.Element }): JSX. Element;
```

Usage:

```tsx
import {Dynamic} from 'woby';

const App = () => {
  const heading = 'h2';
  return (
    <Dynamic component={heading}>
      Some content
    </Dynamic>
  );
};
```

#### `ErrorBoundary`

The error boundary catches errors thrown inside it, and renders a fallback component when that happens.

Interface:

```ts
function ErrorBoundary ( props: { fallback: JSX.Element | (( props: { error: Error, reset: Callback } ) => JSX.Element), children: JSX.Element }): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {ErrorBoundary} from 'woby';

const Fallback = ({ reset, error }: { reset: () => void, error: Error }) => {
  return (
    <>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Recover</button>
    </>
  );
};

const SomeComponentThatThrows = () => {
  throw new Error('whatever');
};

const App = () => {
  return (
    <ErrorBoundary fallback={Fallback}>
      <SomeComponentThatThrows />
    </ErrorBoundary>
  );
};
```

#### `For`

This component is the reactive alternative to natively mapping over an array.

It must be called with an array, or a function that returns an array, of _unique_ values, and each of them are passed to the child function to render something.

Interface:

```ts
function For <T> ( props: { values: FunctionMaybe<readonly T[]>, fallback?: JSX.Element, children: (( value: T, index: FunctionMaybe<number> ) => JSX.Element) }): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {For} from 'woby';

const App = () => {
  const numbers = [1, 2, 3, 4, 5];
  return (
    <For values={numbers}>
      {( value ) => {
        return <p>Value: {value}</p>
      }}
    </For>
  );
};
```

#### `ForIndex`

This component is a reactive alternative to natively mapping over an array, but it takes the index as the unique key instead of the value.

This is an alternative to `For` that uses the index of the value in the array for caching, rather than the value itself.

It's recommended to use `ForIndex` for arrays containing duplicate values and/or arrays containing primitive values, and `For` for everything else.

The passed function will always be called with a read-only observable containing the current value at the index being mapped.

Interface:

```ts
type Value<T = unknown> = T extends ObservableReadonly<infer U> ? ObservableReadonly<U> : ObservableReadonly<T>;

function ForIndex <T> ( props: { values: FunctionMaybe<readonly T[]>, fallback?: JSX.Element, children: (( value: Value<T>, index: number ) => JSX.Element) }): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {ForIndex} from 'woby';

const App = () => {
  const numbers = [1, 2, 3, 4, 5];
  return (
    <ForIndex values={numbers}>
      {( value ) => {
        return <p>Double value: {() => value () ** 2}</p>
      }}
    </ForIndex>
  );
};
```

#### `ForValue`

This component is a reactive alternative to natively mapping over an array, but it caches results for values that didn't change, _and_ repurposes results for items that got discarded for new items that need to be rendered.

This is an alternative to `For` and `ForIndex` that enables reusing the same result for different items, when possible. Reusing the same result means also reusing everything in it, including DOM nodes.

Basically `Array.prototype.map` doesn't wrap the value nor the index in an observable, `For` wraps the index only in an observable, `ForIndex` wraps the value only in an observable, and `ForValue` wraps both the value and the index in observables.

This is useful for use cases like virtualized rendering, where `For` would cause some nodes to be discarded and others to be created, `ForIndex` would cause _all_ nodes to be repurposed, but `ForValue` allows you to only repurpose the nodes that would have been discareded by `For`, not all of them.

This is a more advanced component, it's recommended to simply use `For` or `ForIndex`, until you really understand how to squeeze extra performance with this, and you actually need that performance.

Interface:

```ts
type Value<T = unknown> = T extends ObservableReadonly<infer U> ? ObservableReadonly<U> : ObservableReadonly<T>;

function ForValue <T> ( props: { values: FunctionMaybe<readonly T[]>, fallback?: JSX.Element, children: (( value: Value<T>, index: ObservableReadonly<number> ) => JSX.Element) }): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {ForValue} from 'woby';

const App = () => {
  const numbers = [1, 2, 3, 4, 5];
  return (
    <ForValue values={numbers}>
      {( value ) => {
        return <p>Double value: {() => value () ** 2}</p>
      }}
    </ForValue>
  );
};
```

#### `Fragment`

This is just the internal component used for rendering fragments: `<></>`, you probably would never use this directly even if you are not using JSX, since you can return plain arrays from your components anyway.

Interface:

```ts
function Fragment ( props: { children: JSX.Element }): JSX.Element;
```

Usage:

```tsx
import {Fragment} from 'woby';

const App = () => {
  return (
    <Fragment>
      <p>child 1</p>
      <p>child 2</p>
    </Fragment>
  );
};
```

#### `If`

This component is the reactive alternative to the native `if`.

If a function is passed as the children then it will be called with a read-only observable that contains the current, always truthy, value of the "when" condition.

Interface:

```ts
type Truthy<T = unknown> = Extract<T, number | bigint | string | true | object | symbol | Function>;

function If <T> ( props: { when: FunctionMaybe<T>, fallback?: JSX.Element, children: JSX.Element | (( value: (() => Truthy<T>) ) => JSX.Element) }): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {If} from 'woby';

const App = () => {
  const visible = $(false);
  const toggle = () => visible ( !visible () );
  return (
    <>
      <button onClick={toggle}>Toggle</button>
      <If when={visible}>
        <p>Hello!</p>
      </If>
    </>
  );
};
```

#### `Portal`

This component mounts its children inside a provided DOM element, or inside `document.body` otherwise.

The `mount` prop can also be an observable, if its value changes the portal is reparented.

The `when` prop can be used to apply the portal conditionally, if it explicitly resolves to false then children are mounted normally, as if they weren't wrapped in a portal.

Events will propagate natively, according to the resulting DOM hierarchy, not the components hierarchy.

Interface:

```ts
function Portal ( props: { when: boolean, mount?: JSX.Element, wrapper?: JSX.Element, children: JSX.Element }): (() => JSX.Element | null) & ({ metadata: { portal: HTMLDivElement } });
```

Usage:

```tsx
import Portal from 'woby';

const Modal = () => {
  // Some modal component maybe...
};

const App = () => {
  return (
    <Portal mount={document.body}>
      <Modal />
    </Portal>
  );
};
```

#### `Suspense`

This component is like `If`, the reactive alternative to the native `if`, but the fallback branch is shown automatically while there are some resources loading in the main branch, and the main branch is kept alive under the hood.

So this can be used to show some fallback content while the actual content is loading in the background.

This component relies on `useResource` to understand if there's a resource loading or not.

This component also supports a manual "when" prop for manually deciding whether the fallback branch should be rendered or not.

Interface:

```ts
function Suspense ( props: { when?: FunctionMaybe<unknown>, fallback?: JSX.Element, children: JSX.Element }): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {Suspense} from 'woby';

const App = () => {
  const Content = () => {
    const resource = useResource ( () => makeSomePromise () );
    return (
      <If when={() => !resource ().pending && !resource ().error}>
        {resource ().value}
      </If>
    );
  };
  const Spinner = () => {
    return <p>Loading...</p>;
  };
  return (
    <Suspense fallback={<Spinner />}>
      <Content />
    </Suspense>
  );
};
```

#### `Switch`

This component is the reactive alternative to the native `switch`.

Interface:

```ts
function Switch <T> ( props: { when: FunctionMaybe<T>, fallback?: JSX.Element, children: JSX.Element }): ObservableReadonly<JSX.Element>;

Switch.Case = function <T> ( props: { when: T, children: JSX.Element } ): (() => JSX.Element) & ({ metadata: [T, JSX.Element] });
Switch.Default = function ( props: { children: JSX.Element } ): (() => JSX.Element) & ({ metadata: [JSX.Element] });
```

Usage:

```tsx
import {Switch} from 'woby';

const App = () => {
  const value = $(0);
  const increment = () => value ( value () + 1 );
  const decrement = () => value ( value () - 1 );
  return (
    <>
      <Switch when={value}>
        <Switch.Case when={0}>
          <p>0, the boundary between positives and negatives! (?)</p>
        </Switch.Case>
        <Switch.Case when={1}>
          <p>1, the multiplicative identity!</p>
        </Switch.Case>
        <Switch.Default>
          <p>{value}, I don't have anything interesting to say about that :(</p>
        </Switch.Default>
      </Switch>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
};
```

#### `Ternary`

This component is the reactive alternative to the native ternary operator.

The first child will be rendered when the condition is truthy, otherwise the second child will be rendered.

Interface:

```ts
function Ternary ( props: { when: FunctionMaybe<unknown>, children: [JSX.Element, JSX.Element] } ): ObservableReadonly<JSX.Element>;
```

Usage:

```tsx
import {Ternary} from 'woby';

const App = () => {
  const visible = $(false);
  const toggle = () => visible ( !visible () );
  return (
    <>
      <button onClick={toggle}>Toggle</button>
      <Ternary when={visible}>
        <p>Visible :)</p>
        <p>Invisible :(</p>
      </Ternary>
    </>
  );
};
```

### Hooks

The following hooks are provided.

Many of these are just functions that `soby` provides, re-exported as `use*` functions, the rest are largely just alternatives to web built-ins that can also accept observables as arguments and can dispose of themselves automatically when the parent computation is disposed.

Hooks are just regular functions, if their name starts with `use` then we call them hooks just because.

#### `useAbortController`

This hook is just an alternative to `new AbortController ()` that automatically aborts itself when the parent computation is disposed.

Interface:

```ts
function useAbortController ( signals?: ArrayMaybe<AbortSignal> ): AbortController;
```

Usage:

```tsx
import {useAbortController} from 'woby';

const controller = useAbortController ();
```

#### `useAbortSignal`

This hook is just a convenient alternative to `useAbortController`, if you are only interested in its signal, which is automatically aborted when the parent computation is disposed.

Interface:

```ts
function useAbortSignal ( signals?: ArrayMaybe<AbortSignal> ): AbortSignal;
```

Usage:

```tsx
import {useAbortSignal} from 'woby';

const signal = useAbortSignal ();
```

#### `useAnimationFrame`

This hook is just an alternative to `requestAnimationFrame` that automatically clears itself when the parent computation is disposed.

Interface:

```ts
function useAnimationFrame ( callback: ObservableMaybe<FrameRequestCallback> ): Disposer;
```

Usage:

```tsx
import {useAnimationFrame} from 'woby';

useAnimationFrame ( () => console.log ( 'called' ) );
```

#### `useAnimationLoop`

This hook is just a version of `useAnimationFrame` that loops until the parent computation is disposed.

Interface:

```ts
function useAnimationLoop ( callback: ObservableMaybe<FrameRequestCallback> ): Disposer;
```

Usage:

```tsx
import {useAnimationLoop} from 'woby';

useAnimationLoop ( () => console.log ( 'called' ) );
```

#### `useBoolean`

This hook is like the reactive equivalent of the `!!` operator, it returns you a boolean, or a function to a boolean, depending on the input that you give it.

[Read upstream documentation](https://github.com/wongchichong/soby#boolean).

Interface:

```ts
function useBoolean ( value: FunctionMaybe<unknown> ): FunctionMaybe<boolean>;
```

Usage:

```tsx
import {useBoolean} from 'woby';

useBoolean // => Same as require ( 'soby' ).boolean
```

#### `useCleanup`

This hook registers a function to be called when the parent computation is disposed.

[Read upstream documentation](https://github.com/wongchichong/soby#cleanup).

Interface:

```ts
function useCleanup ( fn: () => void ): void;
```

Usage:

```tsx
import {useCleanup} from 'woby';

useCleanup // => Same as require ( 'soby' ).cleanup
```

#### `useContext`

This hook retrieves the value out of a context object.

Interface:

```ts
function useContext <T> ( context: Context<T> ): T | undefined;
```

Usage:

```tsx
import {createContext, useContext} from 'woby';

const App = () => {
  const ctx = createContext ( 123 );
  const value = useContext ( ctx );
  return <p>{value}</p>;
};
```

#### `useDisposed`

This hook returns a boolean read-only observable that is set to `true` when the parent computation gets disposed of.

[Read upstream documentation](https://github.com/wongchichong/soby#disposed).

Interface:

```ts
function useDisposed (): ObservableReadonly<boolean>;
```

Usage:

```tsx
import {useDisposed} from 'woby';

useDisposed // => Same as require ( 'soby' ).disposed
```

#### `useEffect`

This hook registers a function to be called when any of its dependencies change. If a function is returned it's automatically registered as a cleanup function.

[Read upstream documentation](https://github.com/wongchichong/soby#effect).

Interface:

```ts
function useEffect ( fn: () => (() => void) | void ): (() => void);
```

Usage:

```tsx
import {useEffect} from 'woby';

useEffect // => Same as require ( 'soby' ).effect
```

#### `useError`

This hook registers a function to be called when the parent computation throws.

[Read upstream documentation](https://github.com/wongchichong/soby#error).

Interface:

```ts
function useError ( fn: ( error: Error ) => void ): void;
```

Usage:

```tsx
import {useError} from 'woby';

useError // => Same as require ( 'soby' ).error
```

#### `useEventListener`

This hook is just an alternative to `addEventListener` that automatically clears itself when the parent computation is disposed.

Interface:

```ts
function useEventListener ( target: FunctionMaybe<EventTarget>, event: FunctionMaybe<string>, handler: ObservableMaybe<( event: Event ) => void>, options?: FunctionMaybe<true | AddEventListenerOptions> ): Disposer;
```

Usage:

```tsx
import {useEventListener} from 'woby';

useEventListener ( document, 'click', console.log );
```

#### `useFetch`

This hook wraps the output of a fetch request in an observable, so that you can be notified when it resolves or rejects. The request is also aborted automatically when the parent computation gets disposed of.

This hook uses `useResource` internally, so it's significant for `Suspense` too.

Interface:

```ts
function useFetch ( request: FunctionMaybe<RequestInfo>, init?: FunctionMaybe<RequestInit> ): ObservableReadonly<Resource<Response>>;
```

Usage:

```tsx
import {useFetch} from 'woby';

const App = () => {
  const state = useFetch ( 'https://my.api' );
  return state.on ( state => {
    if ( state.pending ) return <p>pending...</p>;
    if ( state.error ) return <p>{state.error.message}</p>;
    return <p>Status: {state.value.status}</p>
  });
};
```

#### `useIdleCallback`

This hook is just an alternative to `requestIdleCallback` that automatically clears itself when the parent computation is disposed.

Interface:

```ts
function useIdleCallback ( callback: ObservableMaybe<IdleRequestCallback>, options?: FunctionMaybe<IdleRequestOptions> ): Disposer;
```

Usage:

```tsx
import {useIdleCallback} from 'woby';

useIdleCallback ( () => console.log ( 'called' ) );
```

#### `useIdleLoop`

This hook is just a version of `useIdleCallback` that loops until the parent computation is disposed.

Interface:

```ts
function useIdleLoop ( callback: ObservableMaybe<IdleRequestCallback>, options?: FunctionMaybe<IdleRequestOptions> ): Disposer;
```

Usage:

```tsx
import {useIdleLoop} from 'woby';

useIdleLoop ( () => console.log ( 'called' ) );
```

#### `useInterval`

This hook is just an alternative to `setInterval` that automatically clears itself when the parent computation is disposed.

Interface:

```ts
function useInterval ( callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number> ): Disposer;
```

Usage:

```tsx
import {useInterval} from 'woby';

useInterval ( () => console.log ( 'called' ), 1000 );
```

#### `useMemo`

This hook is the crucial other ingredient that we need, other than observables themselves, to have a powerful reactive system that can track dependencies and re-execute computations when needed.

This hook registers a function to be called when any of its dependencies change, and the return of that function is wrapped in a read-only observable and returned.

The function receives an optional `stack` parameter (an Stack object) that provides a debugging stack trace to help pinpoint the source of reactive dependencies. To enable this feature, set `DEBUGGERER.debug = true`.

[Read upstream documentation](https://github.com/wongchichong/soby#memo).

Interface:

```ts
function useMemo <T> ( fn: (stack?: Error) => T, options?: ObservableOptions<T | undefined> ): ObservableReadonly<T>;
```

Usage:

```tsx
import {useMemo} from 'woby';

// With stack parameter for debugging
useMemo((stack) => {
  if (stack) console.log(stack.stack); // Logs stack trace to pinpoint reactive dependencies
  return computeExpensiveValue(a, b);
});
```

#### `useMicrotask`

This hook is just an alternative to `queueMicrotask` that automatically clears itself when the parent computation is disposed, and that ensures things like contexts, error boundaries etc. keep working inside the microtask.

Interface:

```ts
function useMicrotask ( fn: () => void ): void;
```

Usage:

```tsx
import {useMicrotask} from 'woby';

useMicrotask ( () => console.log ( 'called' ) );
```

#### `usePromise`

This hook wraps a promise in an observable, so that you can be notified when it resolves or rejects.

This hook uses `useResource` internally, so it's significant for `Suspense` too.

Interface:

```ts
function usePromise <T> ( promise: FunctionMaybe<Promise<T>> ): ObservableReadonly<Resource<T>>;
```

Usage:

```tsx
import {usePromise} from 'woby';

const App = () => {
  const request = fetch ( 'https://my.api' ).then ( res => res.json ( 0 ) );
  const promise = usePromise ( request );
  return resolved.on ( state => {
    if ( state.pending ) return <p>pending...</p>;
    if ( state.error ) return <p>{state.error.message}</p>;
    return <p>{JSON.stringify ( state.value )}</p>
  });
};
```

#### `useReaction`

This hook works just like `useEffect`, expect that it's not affected by `Suspense`.

This is an advanced hook mostly useful internally, you may never need to use this, `useEffect` and `useMemo` should suffice.

[Read upstream documentation](https://github.com/wongchichong/soby#reaction).

Interface:

```ts
function useReaction ( fn: () => (() => void) | void ): (() => void);
```

Usage:

```tsx
import {useReaction} from 'woby';

useReaction // => Same as require ( 'soby' ).reaction
```

#### `useReadonly`

This hook creates a read-only observable out of another observable.

[Read upstream documentation](https://github.com/wongchichong/soby#readonly).

Interface:

```ts
function useReadonly <T> ( observable: Observable<T> | ObservableReadonly<T> ): ObservableReadonly<T>;
```

Usage:

```tsx
import {useReadonly} from 'woby';

useReadonly // => Same as require ( 'soby' ).readonly
```

#### `useResolved`

This hook receives a value, or an array of values, potentially wrapped in functions and/or observables, and unwraps it/them.

If no callback is used then it returns the unwrapped value, otherwise it returns whatever the callback returns.

This is useful for handling reactive and non reactive values the same way. Usually if the value is a function, or always for convenience, you'd want to wrap the `useResolved` call in a `useMemo`, to maintain reactivity.

This is potentially a more convenient version of `$`, made especially for handling nicely arguments passed that your hooks receive that may or may not be observables.

Interface:

> The precise interface for this function is insane, you can find it here: https://github.com/wongchichong/woby/blob/master/src/hooks/use_resolved.ts

Usage:

```tsx
import {$, useResolved} from 'woby';

useResolved ( 123 ); // => 123

useResolved ( $(123) ); // => 123

useResolved ( () => 123 ); // => 123

useResolved ( () => 123, false ); // => () => 123

useResolved ( $(123), value => 321 ); // => 321

useResolved ( [$(123), () => 123], ( a, b ) => 321 ); // => 321
```

#### `useResource`

This hook wraps the result of a function call with an observable, handling the cases where the function throws, the result is an observable, the result is a promise or an observale that resolves to a promise, and the promise rejects, so that you don't have to worry about these issues.

This basically provides a unified way to handle sync and async results, observable and non observable results, and functions that throw and don't throw.

This function is also the mechanism through which `Suspense` understands if there are things loading under the hood or not.

When the `value` property is read while fetching, or when the `latest` property is read the first time, or after an error, while fetching, then `Suspense` boundaries will be triggered.

When the `value` property or the `latest` property are read after the fetch errored they will throw, triggering `ErrorBoundary`.

The passed function is tracked and it will be automatically re-executed whenever any of the observables it reads change.

Interface:

```ts
function useResource <T> ( fetcher: (() => ObservableMaybe<PromiseMaybe<T>>) ): Resource<T>;
```

Usage:

```tsx
import {useResource} from 'woby';

const fetcher = () => fetch ( 'https://my.api' );

const resource = useResource ( fetcher );
```

#### `useRoot`

This hook creates a new computation root, detached from any parent computation.

[Read upstream documentation](https://github.com/wongchichong/soby#root).

Interface:

```ts
function useRoot <T> ( fn: ( dispose: () => void ) => T ): T;
```

Usage:

```tsx
import {useRoot} from 'woby';

useRoot // => Same as require ( 'soby' ).root
```

#### `useSelector`

This hook massively optimizes `isSelected` kind of workloads.

[Read upstream documentation](https://github.com/wongchichong/soby#selector).

Interface:

```ts
type SelectorFunction<T> = ( value: T ) => ObservableReadonly<boolean>;

function useSelector <T> ( source: () => T | ObservableReadonly<T> ): SelectorFunction<T>;
```

Usage:

```tsx
import {useSelector} from 'woby';

useSelector // => Same as require ( 'soby' ).selector
```

#### `useTimeout`

This hook is just an alternative to `setTimeout` that automatically clears itself when the parent computation is disposed.

Interface:

```ts
function useTimeout ( callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number> ): Disposer;
```

Usage:

```tsx
import {useTimeout} from 'woby';

useTimeout ( () => console.log ( 'called' ), 1000 );
```

### Types

#### `Context`

This type describes the object that `createContext` gives you.

Interface:

```ts
type Context<T = unknown> = {
  Provider ( props: { value: T, children: JSX.Element } ): JSX.Element,
  register ( value: T ): void
};
```

Usage:

```ts
import {useContext} from 'woby';
import type {Context} from 'woby';

// Create an alternative useContext that throws if the context is not available

const useNonNullableContext = <T> ( context: Context<T> ): NonNullable<T> => {
  const value = useContext ( context );
  if ( value === null || value === undefined ) throw new Error ( 'Missing context' );
  return value;
};
```

#### `Directive`

This type describes the object that `createDirective` gives you.

Interface:

```ts
type Directive<Arguments extends unknown[] = []> = {
  Provider: ( props: { children: JSX.Element } ) => JSX.Element,
  ref: ( ...args: Arguments ) => (( ref: Element ) => void),
  register: () => void
};
```

Usage:

```ts
import {$, useEffect} from 'woby';
import type {Directive, FunctionMaybe} from 'woby';

// Example hook for turning a directive into a hook

const useDirective = <T extends unknown[] = []> ( directive: Directive<T> ) => {
  return ( ref: FunctionMaybe<Element | undefined>, ...args: T ): void => {
    useEffect ( () => {
      const target = $(ref);
      if ( !target ) return;
      directive.ref ( ...args )( target );
    });
  };
};
```

#### `DirectiveOptions`

This type describes the options object that the `createDirective` function accepts.

Interface:

```ts
type DirectiveOptions = {
  immediate?: boolean // If `true` the directive is called as soon as the node is created, otherwise it also waits for that node to be attached to the DOM
};
```

Usage:

```tsx
import {createDirective} from 'woby';

// Create an regular, non-immediate, directive

const TooltipDirective = createDirective ( 'tooltip', ( ref, title: string ) => {
  // Implementation...
});

// Create an immediate directive

const TooltipDirectiveImmediate = createDirective ( 'tooltip', ( ref, title: string ) => {
  // Implementation...
}, { immediate: true } );
```

#### `FunctionMaybe`

This type says that something can be the value itself or a function that returns that value.

It's useful at times since some components, like `If`, accept `when` conditions wrapped in `FunctionMaybe`.

Interface:

```ts
type FunctionMaybe<T> = (() => T) | T;
```

Usage:

```tsx
import type {FunctionMaybe} from 'woby';

const SomeConditionalComponent = ( when: FunctionMaybe<boolean>, value: string ): JSX.Element => {
  return (
    <If when={when}>
      {value}
    </If>
  );
};
```

#### `Observable`

This type says that something is a regular observable, which can be updated via its setter.

Interface:

```ts
type Observable<T> = {
  (): T,
  ( value: T ): T,
  ( fn: ( value: T ) => T ): T
};
```

Usage:

```tsx
import type {Observable} from 'woby';

const fn = ( value: Observable<boolean> ): void => {
  value (); // Getting
  value ( true ); // Setting
};
```

#### `ObservableReadonly`

This type says that something is a read-only observable, which can only be read but not updated.

Interface:

```ts
type ObservableReadonly<T> = {
  (): T
};
```

Usage:

```tsx
import type {ObservableReadonly} from 'woby';

const fn = ( value: ObservableReadonly<boolean> ): void => {
  value (); // Getting
  value ( true ); // This will throw!
};
```

#### `ObservableMaybe`

This type says that something can be the value itself or an observable to that value.

This type is particularly useful for creating components and hooks that can accept either plain values or observables, providing flexibility in API design.

Interface:

```ts
type ObservableMaybe<T> = Observable<T> | ObservableReadonly<T> | T;
```

Usage:

```tsx
import type {ObservableMaybe} from 'woby';

const Button = ({ label }: { label: ObservableMaybe<string> }): JSX.Element => {
  return <button>{label}</button>;
};
```

#### `ObservableOptions`

This type describes the options object that various functions can accept to tweak how the underlying observable works.

Interface:

```ts
type ObservableOptions<T> = {
  equals?: (( value: T, valuePrev: T ) => boolean) | false
};
```

Usage:

```tsx
import type {Observable, ObservableOptions} from 'woby';
import {$} from 'woby';

const createTimestamp = ( options?: ObservableOptions ): Observable<number> => {
  return $( Date.now (), options );
};
```

#### `Resource`

This type represents the return value of `useResource`, `usePromise`, and `useFetch` functions.

It represents the state of a resource, indicating whether it is loading, if an error occurred, and what the resulting value will be.

This read-only observable contains the resulting object and provides helper methods for accessing specific properties, enabling cleaner code patterns.

Helper methods are automatically memoized for optimal performance.

Interface:

```ts
type ResourceStaticPending<T> = { pending: true, error?: never, value?: never, latest?: T };
type ResourceStaticRejected = { pending: false, error: Error, value?: never, latest?: never };
type ResourceStaticResolved<T> = { pending: false, error?: never, value: T, latest: T };
type ResourceStatic<T> = ResourceStaticPending<T> | ResourceStaticRejected | ResourceStaticResolved<T>;
type ResourceFunction<T> = { pending (): boolean, error (): Error | undefined, value (): T | undefined, latest (): T | undefined };
type Resource<T> = ObservableReadonly<ResourceStatic<T>> & ResourceFunction<T>;
```

Usage:

```tsx
import type {ObservableReadonly, Resource} from 'woby';

const resource: Resource<Response> = useResource ( () => fetch ( 'https://my.api' ) );

// Reading the static object

resource ().pending; // => true | false
resource ().error; // => Error | undefined
resource ().value; // => Whatever the resource will resolve to
resource ().latest; // => Whatever the resource will resolve to, or the previous known resolved value if the resource is pending

// Using helper methods

resource.pending (); // => true | false
resource.error (); // => Error | undefined
resource.value (); // => Whatever the resource will resolve to
resource.latest (); // => Whatever the resource will resolve to, or the previous known resolved value if the resource is pending
```

#### `StoreOptions`

This type describes the options object that the `store` function accepts.

Interface:

```ts
type StoreOptions = {
  unwrap?: boolean
};
```

Usage:

```ts
import type {StoreOptions} from 'woby';
import {store} from 'woby';

const createStore = <T> ( value: T, options?: StoreOptions ): T => {
  return store ( value, options );
};
```

### Extras

Extra features and details.

#### `Contributing`

If you'd like to contribute to this repo you should take the following steps to install Woby locally:

```sh
git clone https://github.com/vobyjs/woby.git
cd woby
npm install
npm run compile
```

Then you can run any of the demos locally like this:

```sh
# Playground
npm run dev
# Counter
npm run dev:counter
# Benchmark
npm run dev:benchmark
```


#### `JSX`

JSX is supported out of the box and is similar to React JSX with some key differences.

- Attributes can accept plain values, observables, or functions. When observables or functions are provided, attributes update in a fine-grained manner.
- There's no "key" attribute because it's unnecessary.
- Only function-form refs are supported, encouraging the use of observables for ref management.
- The "ref" attribute can also accept an array of functions to call, for convenience.
- The "class" attribute can be used instead of "className".
- The "class" attribute also accepts objects or arrays of classes for enhanced flexibility.
- SVGs are supported out of the box and will also be updated in a fine-grained manner.
- The "innerHTML", "outerHTML", and "textContent" attributes are restricted to prevent anti-patterns and encourage idiomatic usage.
- A React-like "dangerouslySetInnerHTML" attribute is supported for setting some raw HTML.
- Numbers set as values for style properties that require a unit to be provided will automatically be suffixed with "px".
- Using CSS variables in the "style" object is supported out of the box.
- The following events are delegated, automatically: `beforeinput`, `click`, `dblclick`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mouseup`.
- Events always bubble according to the natural DOM hierarchy, there's no special bubbling logic for `Portal`.
- Class components without lifecycle callbacks are also supported. While other frameworks have moved away from class components entirely, organizing internal methods within classes and automatically assigning them to refs provides a useful organizational pattern.

#### `TypeScript`

To use Woby with TypeScript, two main configurations are required:

1. Since Woby is an ESM-only framework, mark your package as ESM by adding the following to your `package.json`:
   ```
   "type": "module"
   ```
2. Configure TypeScript to load the correct JSX types by adding the following to your `tsconfig.json`:
   ```json
    {
      "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "woby"
      }
    }
   ```

Optionally, if not using a bundler or if a plugin is not available for your bundler, define a "React" variable in scope and use the React JSX transform:
   ```ts
   import * as React from 'woby';
   ```

## Thanks

- **[S](https://github.com/adamhaile/S)**: for pioneering reactive programming approaches that inspired this framework.
- **[sinuous/observable](https://github.com/luwes/sinuous/tree/master/packages/sinuous/observable)**: for providing an excellent Observable implementation that served as the foundation for this library.
- **[solid](https://www.solidjs.com)**: for serving as a reference implementation, popularizing signal-based reactivity, and building a strong community.
- **[trkl](https://github.com/jbreckmckye/trkl)**: for demonstrating the power of minimal, focused implementations.

## License

MIT 

