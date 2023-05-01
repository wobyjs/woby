/* IMPORT */
import createElement from './create_element.via.js';
import { isArray, isObject } from '../utils/lang.js';
function h(component, props, ...children) {
    if (children.length || (isObject(props) && !isArray(props))) {
        return createElement(component, props, ...children); //TSC
    }
    else {
        return createElement(component, null, props); //TSC
    }
}
/* EXPORT */
export default h;
