/* IMPORT */
import '../types.js';
import { wrapCloneElement, createElement, Fragment } from '../index.js';
/* MAIN */
const jsx = (component, props) => {
    return wrapCloneElement(createElement(component, props), component, props);
};
/* EXPORT */
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
