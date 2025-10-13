/**
 * Defaults Implementation for Woby Framework
 * 
 * This module provides functionality to attach default props to functional components.
 * 
 * @module defaults
 */

import { isObservable, Observable } from "soby"
import { SYMBOL_DEFAULT, SYMBOL_JSX } from "../constants"
import { assign, AssignOptions } from './assign'
import { $, Observant } from ".."
import { isJsxProp } from "./is_jsx_prop"
import { make } from "./make"

/**
 * Merge function component props with custom element props
 * 
 * This specialized merge function handles the merging of props between
 * JSX function components and custom elements. It uses the assign function
 * with a 'new' condition to only assign properties that exist in the source
 * but not in the target, preserving the intended behavior for component props.
 * 
 * @template T - The type of the target object (typically component props)
 * @template S - The type of the source object (typically default props)
 * 
 * @param target - The target object (component props) to merge into
 * @param source - The source object (default props) to merge from
 * @returns The merged object with props properly combined
 * 
 * @throws {Error} If neither target nor source is a JSX element or custom element
 * 
 * @example
 * ```tsx
 * // Used internally by the defaults() function
 * const mergedProps = merge(componentProps, defaultProps)
 * ```
 */
const merge = <T, S>(
    target: T,
    source: S
) => {
    // If source is a JSX element, assign target properties to it
    // if (isJsxProp(source))
    //     return assign(source, target, { condition: 'new' })
    // // If target is a JSX element, assign source properties to it
    // else if (isJsxProp(target))
    //     return assign(target, source, { condition: 'new' })
    // // For regular objects, merge them with target taking precedence
    // else
    return assign(target, source, { condition: 'new' })
}


/**
 * Attaches default props to a functional component
 * 
 * This function allows you to attach default props to a functional component,
 * making it easier to create reusable components with sensible defaults.
 * 
 * @template P - Component props type
 * @template T - Component function type
 * 
 * @param defs - Function that returns the default props
 * @param component - The functional component to attach defaults to
 * @returns The component with defaults attached
 * 
 * @example
 * ```tsx
 * interface CounterProps {
 *   value?: Observable<number>
 *   increment?: () => void
 *   decrement?: () => void
 * }
 * 
 * // Using named function
 * function def() {
 *   return {
 *     value: $(0),
 *     increment: () => {},
 *     decrement: () => {}
 *   }
 * }
 * 
 * const Counter = defaults(def, (props: CounterProps) => {
 *   const { value, increment, decrement } = props
 *   return (
 *     <div>
 *       <p>{value}</p>
 *       <button onClick={increment}>+</button>
 *       <button onClick={decrement}>-</button>
 *     </div>
 *   )
 * })
 * 
 * // Using inline function
 * const CounterInline = defaults(() => ({
 *   value: $(0),
 *   increment: () => {},
 *   decrement: () => {}
 * }), (props: CounterProps) => {
 *   const { value, increment, decrement } = props
 *   return (
 *     <div>
 *       <p>{value}</p>
 *       <button onClick={increment}>+</button>
 *       <button onClick={decrement}>-</button>
 *     </div>
 *   )
 * })
 * ```
 */
export const defaults = <P extends { children?: Observable<JSX.Children> }, T extends (props: P) => JSX.Element>(
    defs: () => P,
    component: T
): ((props: Observant<P>) => JSX.Element) & { [SYMBOL_DEFAULT]: () => P } => {
    const defFactory = () => {
        const d: P & { children?: Observable<JSX.Children> } = defs() // as P & { children?: Observable<JSX.Children> }
        if (d.children !== undefined && !isObservable(d.children))
            d.children = $(d.children)
        if (!d.children)
            d.children = $()
        return d
    }
    // const compFactory = Object.assign((props: Observant<P>) => component(merge(props, defFactory()) as unknown as P),
    const compFactory = Object.assign((props: Observant<P>) => component(isJsxProp(props) ? merge(make(props, { inplace: true, convertFunction: false }), defFactory()) as any : props),
        {
            [SYMBOL_DEFAULT]: defFactory
        })

    return compFactory as ((props: Observant<P>) => JSX.Element) & { [SYMBOL_DEFAULT]: () => P }
}       