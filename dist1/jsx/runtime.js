/* IMPORT */
import './types.js';
import Fragment from '../components/fragment.js';
import createElement from '../methods/create_element.js';
/* MAIN */
const jsx = (component, props) => {
    return createElement(component, props);
};
/* EXPORT */
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
