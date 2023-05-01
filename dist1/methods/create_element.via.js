/* IMPORT */
// import untrack from './untrack.js'
import wrapElement from './wrap_element.js';
import { createHTMLNode, createSVGNode } from '../utils/creators.via.js';
import { isFunction, isNil, isNode, isString, isSVGElement, isVoidChild } from '../utils/lang.js';
import { setProps } from '../utils/setters.via.js';
import { untrack } from 'oby';
import { IgnoreSymbols } from 'via';
import '../jsx/types.js';
/* MAIN */
export const IsSvgSymbol = Symbol('isSvg');
IgnoreSymbols[IsSvgSymbol] = IsSvgSymbol;
// It's important to wrap components, so that they can be executed in the right order, from parent to child, rather than from child to parent in some cases
const createElement = (component, props, ..._children) => {
    const { children: __children, key, ref, ...rest } = (props || {}); //TSC
    let children = (_children.length === 1) ? _children[0] : (_children.length === 0) ? __children : _children;
    if (isFunction(component)) {
        const props = rest;
        if (!isNil(children))
            props.children = children;
        if (!isNil(ref))
            props.ref = ref;
        // return wrapElement(() => untrack(() => component.call(component, props as P)))
        return wrapElement(() => component.call(component, props));
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
            if (isSVG) {
                child['isSVG'] = true; // set via
                child[IsSvgSymbol] = true; // set proxy
            }
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
