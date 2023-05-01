/* IMPORT */
import untrack from './untrack.js';
import wrapElement from './wrap_element.js';
import { createHTMLNode, createSVGNode } from '../utils/creators.js';
import { isFunction, isNil, isNode, isString, isSVGElement, isVoidChild } from '../utils/lang.js';
import { setProps } from '../utils/setters.js';
/* MAIN */
// It's important to wrap components, so that they can be executed in the right order, from parent to child, rather than from child to parent in some cases
const createElement = (component, props, ..._children) => {
    const { children: __children, key, ref, ...rest } = (props || {}); //TSC
    const children = (_children.length === 1) ? _children[0] : (_children.length === 0) ? __children : _children;
    if (isFunction(component)) {
        const props = rest;
        if (!isNil(children))
            props.children = children;
        if (!isNil(ref))
            props.ref = ref;
        return wrapElement(() => {
            return untrack(() => component.call(component, props)); //TSC
        });
    }
    else if (isString(component)) {
        const props = rest;
        const isSVG = isSVGElement(component);
        const createNode = isSVG ? createSVGNode : createHTMLNode;
        if (!isVoidChild(children))
            props.children = children;
        if (!isNil(ref))
            props.ref = ref;
        return wrapElement(() => {
            const child = createNode(component); //TSC
            if (isSVG)
                child['isSVG'] = true;
            untrack(() => setProps(child, props));
            return child;
        });
    }
    else if (isNode(component)) {
        return wrapElement(() => component);
    }
    else {
        throw new Error('Invalid component');
    }
};
/* EXPORT */
export default createElement;
