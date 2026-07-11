import type { Child, Classes, EventListener, Fragment, FunctionMaybe, ObservableMaybe, Ref, TemplateActionProxy } from '../types';
import { Stack } from '../soby';
export declare const setAttributeStatic: (element: HTMLElement, key: string, value: null | undefined | boolean | number | string) => void;
export declare const setAttribute: (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | boolean | number | string>, stack: Stack) => void;
export declare const setChildReplacementFunction: (parent: HTMLElement | Node, fragment: Fragment, child: (() => Child), stack: Stack) => void;
export declare const setChildReplacementText: (child: string, childPrev: Node) => Node;
export declare const setChildReplacement: (child: Child, childPrev: Node, stack: Stack) => void;
/**
 * Sets child nodes on a parent element with static (non-reactive) values.
 *
 * This function efficiently updates the DOM by comparing the current children (in the fragment)
 * with the new children and applying the minimal set of DOM operations needed.
 *
 * The function handles several optimization cases:
 * 1. Fast path for appending a node the first time
 * 2. Fast path for single text child replacement
 * 3. Fast path for removing all children or replacing placeholders
 * 4. General diffing algorithm for complex changes
 *
 * @param parent - The parent DOM element to update
 * @param fragment - A fragment representing the current children state
 * @param fragmentOnly - Whether to only update the fragment without touching the actual DOM
 * @param child - The new child or children to set
 * @param dynamic - Whether the child is dynamic (reactive) or static
 * @param stack - The stack trace for debugging purposes
 *
 * @example
 * ```ts
 * // Set a simple text child
 * setChildStatic(parent, fragment, false, "Hello World", false, stack)
 *
 * // Set multiple children
 * setChildStatic(parent, fragment, false, [node1, node2, "text"], false, stack)
 *
 * // Set a function child (will be resolved)
 * setChildStatic(parent, fragment, false, () => "Dynamic content", true, stack)
 * ```
 */
export declare const setChildStatic: (parent: HTMLElement | Node, fragment: Fragment, fragmentOnly: boolean, child: Child, dynamic: boolean, childComp: Function, stack: Stack) => void;
export declare const setChild: (parent: HTMLElement | Node, child: Child, fragment?: Fragment, stack?: Stack) => void;
export declare const setClassStatic: (element: HTMLElement, classes: string, force: null | undefined | boolean) => void;
export declare const setClass: (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | boolean>, stack: Stack) => void;
export declare const setClassBooleanStatic: (element: HTMLElement, value: boolean, key: null | undefined | boolean | string, keyPrev?: null | undefined | boolean | string) => void;
export declare const setClassBoolean: (element: HTMLElement, value: boolean, key: FunctionMaybe<null | undefined | boolean | string>, stack: Stack) => void;
export declare const setClassesStatic: (element: HTMLElement, object: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, objectPrev: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, stack: Stack) => void;
export declare const setClasses: (element: HTMLElement, object: Classes, stack: Stack) => void;
export declare const setDirective: <T extends unknown[]>(element: HTMLElement, directive: string, args: T) => void;
export declare const setEventStatic: (element: HTMLElement, event: string, value: null | undefined | EventListener) => void;
export declare const setEvent: (element: HTMLElement, event: string, value: ObservableMaybe<null | undefined | EventListener>, stack: Stack) => void;
/**
 * Set innerHTML on an element. WARNING: This function does NOT sanitize input.
 * Callers MUST ensure the HTML string is trusted or sanitized before passing it here.
 * Consider using DOMPurify or similar library for user-provided content.
 * @see https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Server-Side_Request_Forgery
 */
export declare const setHTMLStatic: (element: HTMLElement, value: null | undefined | number | string) => void;
/**
 * Set innerHTML from a dangerouslySetInnerHTML object. WARNING: This function does NOT sanitize input.
 * Callers MUST ensure the HTML string is trusted or sanitized before passing it here.
 * @param element - Target HTML element
 * @param value - Object with __html property containing the HTML string
 * @param stack - Component stack for debugging
 */
export declare const setHTML: (element: HTMLElement, value: FunctionMaybe<{
    __html: FunctionMaybe<null | undefined | number | string>;
}>, stack: Stack) => void;
export declare const setPropertyStatic: (element: HTMLElement | Comment, key: string, value: null | undefined | boolean | number | string) => void;
export declare const setProperty: (element: HTMLElement | Comment, key: string, value: FunctionMaybe<null | undefined | boolean | number | string>, stack: Stack) => void;
export declare const setRef: <T>(element: T, value: null | undefined | Ref<T> | (null | undefined | Ref<T>)[]) => void;
export declare const setStyleStatic: (element: HTMLElement, key: string, value: null | undefined | number | string) => void;
export declare const setStyle: (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | number | string>, stack: Stack) => void;
export declare const setStylesStatic: (element: HTMLElement, object: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, objectPrev: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, stack: Stack) => void;
export declare const setStyles: (element: HTMLElement, object: FunctionMaybe<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>>, stack: Stack) => void;
export declare const setTemplateAccessor: (element: HTMLElement, key: string, value: TemplateActionProxy) => void;
export declare const setProp: (element: HTMLElement | Comment, key: string, value: any, stack: Stack) => void;
export declare const setProps: (element: HTMLElement | Comment, object: Record<string, unknown>, stack: Stack) => void;
export declare const getSetters: () => {
    setChild: (parent: HTMLElement | Node, child: Child, fragment?: Fragment, stack?: Stack) => void;
    setChildStatic: (parent: HTMLElement | Node, fragment: Fragment, fragmentOnly: boolean, child: Child, dynamic: boolean, childComp: Function, stack: Stack) => void;
    setChildReplacement: (child: Child, childPrev: Node, stack: Stack) => void;
    setChildReplacementText: (child: string, childPrev: Node) => Node;
    setChildReplacementFunction: (parent: HTMLElement | Node, fragment: Fragment, child: (() => Child), stack: Stack) => void;
    setAttributeStatic: (element: HTMLElement, key: string, value: null | undefined | boolean | number | string) => void;
    setAttribute: (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | boolean | number | string>, stack: Stack) => void;
    setEventStatic: (element: HTMLElement, event: string, value: null | undefined | EventListener) => void;
    setEvent: (element: HTMLElement, event: string, value: ObservableMaybe<null | undefined | EventListener>, stack: Stack) => void;
    setClassStatic: (element: HTMLElement, classes: string, force: null | undefined | boolean) => void;
    setClass: (element: HTMLElement, key: string, value: FunctionMaybe<null | undefined | boolean>, stack: Stack) => void;
    setClassBooleanStatic: (element: HTMLElement, value: boolean, key: null | undefined | boolean | string, keyPrev?: null | undefined | boolean | string) => void;
    setClassBoolean: (element: HTMLElement, value: boolean, key: FunctionMaybe<null | undefined | boolean | string>, stack: Stack) => void;
    setClassesStatic: (element: HTMLElement, object: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, objectPrev: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, stack: Stack) => void;
    setClasses: (element: HTMLElement, object: Classes, stack: Stack) => void;
    setDirective: <T extends unknown[]>(element: HTMLElement, directive: string, args: T) => void;
};
//# sourceMappingURL=setters.d.ts.map