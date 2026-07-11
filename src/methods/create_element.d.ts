/**
 * Element Creation API for Woby Framework
 *
 * This module provides the createElement function which is responsible for creating elements
 * in the Woby framework. It handles different types of components including functional components,
 * HTML elements, SVG elements, and custom elements.
 *
 * @module createElement
 */
import type { Child, Component } from '../types';
/**
 * Creates an element from a component, props, and children
 *
 * This function is the core of the Woby rendering system. It handles the creation of elements
 * from various types of components:
 * 1. Functional components - Calls the function with props
 * 2. Class components - Instantiates the class with props
 * 3. String components - Creates HTML/SVG elements or custom elements
 * 4. Node components - Wraps existing DOM nodes
 *
 * @template P - The type of props for the component
 * @param component - The component to create (function, class, string tag name, or DOM node)
 * @param _props - The props to pass to the component
 * @param _children - The children elements
 * @returns A wrapped element that can be rendered
 *
 * @example
 * ```tsx
 * // Creating a functional component
 * const MyComponent = ({ name }: { name: string }) => <div>Hello, {name}!</div>
 * const element = createElement(MyComponent, { name: 'World' })
 *
 * // Creating an HTML element
 * const divElement = createElement('div', { className: 'container' }, 'Hello World')
 *
 * // Creating an SVG element
 * const svgElement = createElement('svg', { width: 100, height: 100 })
 *
 * // Creating a custom element
 * customElement('my-custom-element', ({ value }: { value: number }) => <div>Value: {value}</div>)
 * const customElementInstance = createElement('my-custom-element', { value: 42 })
 * ```
 */
export declare const createElement: <P = {
    children?: Child;
}>(component: Component<P>, _props?: P | null, ..._children: Child[]) => any;
//# sourceMappingURL=create_element.d.ts.map