import './types';
import Fragment from '../components/fragment';
import type { Component, Element } from '../types';
declare const jsx: <P = {}>(component: Component<P>, props?: P) => Element;
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
