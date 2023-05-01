/* IMPORT */
;
import { isFunction, isPrimitive } from '../utils/lang.js';
import { SYMBOL_CLONE } from '../constants.js';
import createElement from './create_element.js';
import { wrapCloneElement } from './wrap_clone_element.js';
/* MAIN */
export const cloneElement = (element, props) => {
    if (isPrimitive(element))
        return element;
    else if (isFunction(element)) {
        if (!element[SYMBOL_CLONE])
            throw new Error('target is not cloneable, it is not created by jsx.createElement');
        const { component, props: oldProps } = element[SYMBOL_CLONE];
        const newProps = { ...oldProps, props };
        return wrapCloneElement(createElement(component, newProps), component, newProps);
    }
    else if (Array.isArray(element))
        return element.map(e => cloneElement(e, props));
    else if (element.cloneNode) //native html
        return element.cloneNode();
    throw new Error("Unknown element");
};
export default cloneElement;
