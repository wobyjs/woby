/**
 * Counter Component Demo
 *
 * This is a demonstration of creating a custom element with the Woby framework
 * that showcases reactive properties, nested properties, and style attributes.
 *
 * The demo illustrates several important concepts:
 * 1. Custom element creation with proper defaults
 * 2. HTML attribute serialization using toHtml and fromHtml options
 * 3. Function storage in observables using array notation
 * 4. Object and Date serialization
 * 5. Context usage in custom elements
 * 6. Differences between HTML and JSX usage of custom elements
 *
 * @file index.tsx
 */
import { type ElementAttributes } from 'woby';
declare const CounterContext: any;
declare const useCounterContext: () => any;
/**
 * Counter Component
 *
 * A custom element that demonstrates various features of Woby custom elements:
 * - Reactive properties with type conversion
 * - Nested properties
 * - Style properties
 * - Object and Date serialization
 * - Function properties (hidden from HTML)
 * - Context usage
 */
declare const Counter: any;
declare const ContextValue: any;
declare const ProcessedContextValue: any;
export { Counter, ContextValue, CounterContext, useCounterContext };
/**
 * Extend JSX namespace to include the custom element
 *
 * This allows TypeScript to recognize the custom element in JSX.
 */
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            /**
             * Counter custom element
             *
             * HTML element that displays a counter with increment/decrement buttons.
             *
             * The ElementAttributes<typeof Counter> type automatically includes:
             * - All HTML attributes
             * - Component-specific props from CounterProps
             * - Style properties via the style-* pattern (style$font-size in HTML, style-font-size in JSX)
             * - Nested properties via the nested-* pattern (nested$nested$text in HTML, nested-nested-text in JSX)
             */
            'counter-element': ElementAttributes<typeof Counter>;
            'context-value': ElementAttributes<typeof ContextValue>;
            'my-上下文-值': ElementAttributes<typeof ContextValue>;
            'processed-context-value': ElementAttributes<typeof ProcessedContextValue>;
        }
    }
}
export default Counter;
//# sourceMappingURL=index.d.ts.map