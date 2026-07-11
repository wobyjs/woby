import type { Component, Child, Refs } from '../types';
export interface CloneableType<P extends {
    children?: Child;
    ref?: Refs;
} = {
    children?: Child;
    ref?: Refs;
}> {
    Component: Component<P>;
    props?: P | null;
}
export declare const wrapCloneElement: <T, P>(target: T, component: Component<P>, props?: P | null) => T;
//# sourceMappingURL=wrap_clone_element.d.ts.map