
/* IMPORT */

import '../types';
import Fragment from '../components/fragment';
// import createElement from '../methods/create_element';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Component, Element } from '../types';
import { wrapCloneElement, createElement } from '../index';

/* MAIN */

// const jsx = <P = {}>(component: Component<P>, props?: P | null, ...children: Child[]): Element => {
//     return wrapCloneElement(createElement<P>(component as any, props, ...children), component, props);
// };

const jsx = <P = {}>(component: Component<P>, props: P | null, key: string): Element => {
    return wrapCloneElement(createElement<P>(component as any, props, key), component, props);
};

const jsxDEV = <P = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: { fileName: string, lineNumber: number, columnNumber: number; }, self: any): Element => {
    return wrapCloneElement(createElement<P>(component as any, props, key), component, props);
};

/* EXPORT */

export { jsx, jsx as jsxs, jsxDEV, Fragment };
