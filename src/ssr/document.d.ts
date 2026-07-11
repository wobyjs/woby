/**
 * Mock document object for SSR
 */
import { Comment } from "./comment";
import { Element } from "./element";
import type { FN } from "../types";
type EventListenerObject = {
    handleEvent(object: Event): void;
};
type EventListenerOrEventListenerObject = EventListener | EventListenerObject;
type AddEventListenerOptions = boolean | {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
};
type EventListenerOptions = {
    capture?: boolean;
};
export declare const createComment: FN<[string], Comment>;
export declare const createElement: FN<[string], HTMLElement>;
export declare const createHTMLNode: FN<[string], HTMLElement>;
export declare const createSVGNode: FN<[string], SVGElement>;
export declare const createText: FN<[string], Text>;
export declare const createDocumentFragment: FN<[], DocumentFragment>;
/**
 * Type definition for SSR Document interface
 */
export interface SSRDocument {
    _eventListeners: Map<string, Array<{
        listener: EventListenerOrEventListenerObject;
        options?: boolean | AddEventListenerOptions;
    }>>;
    body: HTMLElement;
    head: HTMLElement;
    createComment: typeof createComment;
    createElement: typeof createElement;
    createElementNS: FN<[string, string], Element>;
    createTextNode: typeof createText;
    createDocumentFragment: typeof createDocumentFragment;
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
    _getEventListeners: (type: string) => Array<{
        listener: EventListenerOrEventListenerObject;
        options?: boolean | AddEventListenerOptions;
    }>;
}
/**
 * Factory function to create isolated SSR document instances
 * Use this when you need separate document contexts (e.g., parallel tests, multiple renders)
 */
export declare const createDocument: () => SSRDocument;
/**
 * Default singleton document instance for simple use cases
 * Maintains backward compatibility with existing code
 */
export declare const document: SSRDocument;
export {};
//# sourceMappingURL=document.d.ts.map