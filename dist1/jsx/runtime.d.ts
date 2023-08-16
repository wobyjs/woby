import './types';
import Fragment from '../components/fragment';
import type { Component, JSX.Element } from '../types';
declare const jsx: <P = {}>(component: Component<P>, props?: P) => JSX.Element;
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
