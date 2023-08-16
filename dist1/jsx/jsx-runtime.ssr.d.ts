import '../types';
import type { Component, JSX.Element } from '../types';
import { Fragment } from '../index.ssr';
declare const jsx: <P extends {
    children: any | any[];
}>(component: Component<P>, props?: P) => JSX.Element;
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment, };
