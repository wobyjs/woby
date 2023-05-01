import type { Child, Component, Element } from '../types';
declare const createElement: <P = {}>(component: Component<P>, props?: P, ..._children: Child[]) => Element;
export default createElement;
