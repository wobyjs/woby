import '../types';
import './types';
export { Fragment } from '../components/fragment';
import type { Child, Component, Element } from '../types';
import { CloneableType } from '../methods/wrap_clone_element';
export declare const unwrapJsx: <P>(props: P) => P;
export declare const isJsx: <P>(props: P) => boolean;
export declare function jsx<P extends {} = {}>(component: Component<P>, props?: P, ...children: Child[]): Element;
export declare function jsx<P extends {} = {
    key?: string;
    children?: Child;
}>(component: Component<P>, props?: P, key?: string): Element;
export declare const jsxDEV: <P extends {} = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: {
    fileName: string;
    lineNumber: number;
    columnNumber: number;
}, self: any) => Element;
export declare const getMeta: (target: Element) => CloneableType;
export declare const jsxs: typeof jsx;
//# sourceMappingURL=runtime.d.ts.map