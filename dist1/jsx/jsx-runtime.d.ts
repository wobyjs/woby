import '../types';
import type { Component, Element } from '../types';
import { Fragment } from '../index';
declare const jsx: <P = {}>(component: Component<P>, props?: P) => Element;
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
