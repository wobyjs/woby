import type { Child, Component, JSX.Element } from '../types';
import '../jsx/types';
declare const createElement: <P = {}>(component: string | (new (props: {}) => Child) | import("../types").ComponentFunction<P>, props?: P, ..._children: Child[]) => JSX.Element;
export default createElement;
