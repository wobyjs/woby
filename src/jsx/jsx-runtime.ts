
/* IMPORT */

import '../types';
// import Fragment from '../components/fragment';
// import createElement from '../methods/create_element';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Component, Element } from '../types';
import { wrapCloneElement, createElement, Fragment } from '../index';

/* MAIN */

const jsx = <P = {}>(component: Component<P>, props?: P | null): Element => {
  return wrapCloneElement(createElement<P>(component as any, props), component, props);
};

/* EXPORT */

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
