import type { Child, Component, Element } from '../types';
export declare function h<P extends {
    children?: Child;
} = {}>(component: Component<P>, child: Child): Element;
export declare function h<P extends {
    children?: Child;
} = {}>(component: Component<P>, props?: P | null, ...children: Child[]): Element;
//# sourceMappingURL=h.d.ts.map