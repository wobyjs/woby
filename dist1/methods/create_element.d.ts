import type { Child, Component, JSX.Element } from '../types';
declare const createElement: <P = {}>(component: Component<P>, props?: P, ..._children: Child[]) => JSX.Element;
export default createElement;
