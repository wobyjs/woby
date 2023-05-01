/* IMPORT */
import '../types';
import { Fragment, createElement, wrapCloneElement } from '../index.ssr';
// import $ from 'oby'
/* MAIN */
const jsx = (component, props) => {
    return wrapCloneElement(createElement(component, props), component, props);
};
// const jsxs = <P extends { children: any | any[] }>(component: Component<P>, props?: P | null): Element => {
//     return jsx(component, props)
// }
/* EXPORT */
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment, };
