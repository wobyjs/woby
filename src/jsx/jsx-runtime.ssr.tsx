/* IMPORT */

import '../types';
// import Fragment from '../components/fragment';
// import createElement from '../methods/create_element.ssr';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Component, Element } from '../types';
import { Fragment, createElement, wrapCloneElement } from '../ssr';
// import $ from 'oby'

/* MAIN */

const jsx = <P extends { children: any | any[]; }>(component: Component<P>, props?: P | null): Element => {
    return wrapCloneElement(createElement<P>(component as any, props), component, props);
};

// const jsxs = <P extends { children: any | any[] }>(component: Component<P>, props?: P | null): Element => {
//     return jsx(component, props)
// }
/* EXPORT */

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment, };
