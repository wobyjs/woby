import type { ComponentFunction, Falsy, TemplateActionProxy, Truthy } from '../types';
export declare const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export declare const castArray: <T>(value: T[] | T) => T[];
export declare const castError: (exception: unknown) => Error;
export declare const flatten: <T>(arr: T[]) => FlatArray<T, 0 | 2 | 1 | -1 | 3 | 9 | 8 | 4 | 5 | 11 | 6 | 7 | 10 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20>[];
export declare const indexOf: <T>(arr: ArrayLike<unknown>, value: T) => number;
export declare const isArray: <T>(a: any) => a is Array<T>;
export declare const isBoolean: (value: unknown) => value is boolean;
export declare const isComponent: (value: unknown) => value is ComponentFunction;
export declare const isError: (value: unknown) => value is Error;
export declare const isFalsy: <T>(value: T) => value is Falsy<T>;
export declare const isFunction: (value: unknown) => value is ((...args: any[]) => any);
export declare const isClass: <T>(fn: T) => boolean;
export declare const isFunctionReactive: (value: Function) => boolean;
export declare const isNil: (value: unknown) => value is null | undefined;
export declare const isNode: (value: unknown) => value is Node;
export declare const isObject: (value: unknown) => value is object;
export declare const isPrimitive: (value: unknown) => value is string | number | boolean | symbol | null | undefined | bigint;
export declare const isPromise: (value: unknown) => value is Promise<unknown>;
export declare const isString: (value: unknown) => value is string;
export declare const isSVG: (value: Element | Comment) => value is SVGElement;
export declare const isSVGElement: (element: string) => boolean;
export declare const isTemplateAccessor: (value: unknown) => value is TemplateActionProxy;
export declare const isTruthy: <T>(value: T) => value is Truthy<T>;
export declare const isVoidChild: (value: unknown) => value is null | undefined | symbol | boolean;
export declare const noop: () => void;
export declare const once: <T>(fn: () => T) => (() => T);
export declare const isProxy: (proxy: any) => proxy is typeof Proxy;
export declare const fixBigInt: (v: any | bigint) => any;
/**
 * Checks if a value is a pure function (not an observable)
 *
 * This utility function determines whether a given value is a plain function
 * that is not wrapped as an observable. This is useful for distinguishing
 * between reactive and non-reactive functions in the Woby framework.
 *
 * @param fn - The value to check
 * @returns True if the value is a pure function, false otherwise
 *
 * @example
 * ```typescript
 * isPureFunction(() => {}) // returns true
 * isPureFunction($(console.log)) // returns false
 * isPureFunction('not a function') // returns false
 * ```
 */
export declare const isPureFunction: (fn: Function) => boolean;
export declare const toArray: <T>(v: T | T[]) => T[];
//# sourceMappingURL=lang.d.ts.map