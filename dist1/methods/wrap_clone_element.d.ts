import type { Component, Props } from '../types';
export interface CloneableType<P extends Props> {
    component: Component<P>;
    props?: P | null;
}
export declare const wrapCloneElement: <T, P extends Props>(target: T, component: Component<P>, props?: P) => T;
