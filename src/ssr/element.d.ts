/**
 * Element implementation for SSR
 * This class represents the base Element class in the DOM hierarchy
 */
import { BaseNode } from './base_node';
import { Style } from './style';
export declare class Element extends BaseNode {
    #private;
    tagName: string;
    style: Style;
    attributes: Record<string, string>;
    constructor(tagName: string);
    set className(value: string);
    get className(): string;
    set id(value: string);
    get id(): string;
    get innerHTML(): string;
    set innerHTML(content: string);
    getAttribute(name: string): string | null;
    setAttribute(name: string, value: any): void;
    removeAttribute(name: string): void;
    hasAttribute(name: string): boolean;
    append(...nodes: any[]): void;
    before(...nodes: any[]): void;
    get outerHTML(): string;
    cloneNode(deep?: boolean): globalThis.Node;
    replaceWith(...nodes: (globalThis.Node | string)[]): void;
}
//# sourceMappingURL=element.d.ts.map