/**
 * Base class with shared methods for all node types
 */
import type { MutationRecord } from './mutation_record';
import type { MutationObserverInit } from './mutation_observer_init';
export declare class BaseNode {
    nodeType: number;
    attributes: Record<string, string>;
    childNodes: any[];
    parentNode: any | null;
    _mutations$: any;
    _observers: Array<{
        observer: any;
        options: MutationObserverInit;
    }>;
    classList: {
        toggle: (className: string, force?: boolean) => boolean;
    };
    _eventListeners: Map<string, Array<(event: any) => void>>;
    constructor(nodeType: number);
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
    dispatchEvent(event: any): boolean;
    appendChild(child: any): any;
    append(...nodes: any[]): void;
    insertBefore(newNode: any, referenceNode: any): any;
    removeChild(child: any): any;
    replaceChild(newChild: any, oldChild: any): any;
    replaceWith(...nodes: any[]): void;
    setAttribute(name: string, value: any): void;
    removeAttribute(name: string): void;
    _notifyMutation(mutation: MutationRecord): void;
    _addObserver(observer: any, options: MutationObserverInit): void;
    _removeObserver(observer: any): void;
    get nextSibling(): any | null;
    get previousSibling(): any | null;
    get firstChild(): any | null;
    get lastChild(): any | null;
    get isConnected(): boolean;
    get baseURI(): string;
    get nodeName(): string;
    get ownerDocument(): any | null;
    get parentElement(): any | null;
    compareDocumentPosition(other: any): number;
    contains(other: any): boolean;
    getRootNode(): any;
    hasChildNodes(): boolean;
    isDefaultNamespace(prefix: string): boolean;
    isEqualNode(other: any): boolean;
    isSameNode(other: any): boolean;
    lookupNamespaceURI(prefix: string): string | null;
    lookupPrefix(namespaceURI: string): string | null;
    normalize(): void;
}
//# sourceMappingURL=base_node.d.ts.map