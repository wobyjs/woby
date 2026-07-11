/**
 * Defaults Implementation for Woby Framework
 *
 * This module provides functionality to attach default props to functional components.
 *
 * @module defaults
 */
import type { ObservableMaybe } from '../types';
/**
 * Props for controlling stylesheet encapsulation in custom elements
 *
 * @property ignoreStyle - If true, prevents adoption of stylesheets in shadow DOM
 */
export interface StyleEncapsulationProps {
    /**
     * If true, prevents adoption of stylesheets in shadow DOM
     * @default false
     */
    ignoreStyle?: boolean;
}
export type CustomElementChildren = ObservableMaybe<JSX.Children | HTMLSlotElement> | undefined;
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
 *
 * // Using style encapsulation options
 * const CounterNoStyles = defaults(() => ({
 *   value: $(0),
 *   increment: () => {},
 *   decrement: () => {},
 *   ignoreStyle: true // Prevent adoption of global stylesheets
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
export declare const defaults: <P extends Record<string, any>>(defs: () => P, component: ((props: P & {
    children?: CustomElementChildren;
} & StyleEncapsulationProps) => JSX.Element)) => ((props: Partial<P> & {
    children?: CustomElementChildren;
} & StyleEncapsulationProps) => JSX.Element);
//# sourceMappingURL=defaults.d.ts.map