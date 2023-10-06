import type { Child, Component, Element } from '../types';
declare const createElement: <P = {}>(component: string | (new (props: {}) => Child) | import("../types").ComponentFunction<P>, props?: P, ..._children: Child[]) => Element;
export default createElement;
