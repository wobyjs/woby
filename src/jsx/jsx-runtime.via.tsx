/* IMPORT */

import '../types';
import Fragment from '../components/fragment';
import createElement from '../methods/create_element.via';
import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Component, Element } from '../types';
import 'viajs';
/* MAIN */

const debugHTML = (p: HTMLElement, name: string) => {
    if (p)
        (async () => {
            const nn = await get(p.nodeName);
            const nt = await get(p.nodeType);
            console.log(name + "; ");
            // const html = await get(p.outerHTML)
            console.log(name, p, nn, nt/* , html */);
        })();
};

// React 16
function jsx<P = {}>(component: Component<P>, props?: P, ...children: Child[]): Element;
//React 17
function jsx<P = { key?: string; children?: Child; }>(component: Component<P>, props?: P, key?: string): Element;
function jsx<P = { key?: string; children?: Child; }>(component: Component<P>, props?: P, ...children: (string | Child)[]): Element {
    if (typeof children === 'string') // React 16, key
        return wrapCloneElement(createElement<P>(component as any, props ?? {} as P, children as string), component, props);

    if (!props) props = {} as any;
    Object.assign(props, { children });

    return wrapCloneElement(createElement<P>(component as any, props, (props as any)?.key as string), component, props);
};

//React 17 only
const jsxDEV = <P = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: { fileName: string, lineNumber: number, columnNumber: number; }, self: any): Element => {
    return wrapCloneElement(createElement<P>(component as any, props, key, isStatic, source, self), component, props);
};

/* EXPORT */

export { jsx, jsx as jsxs, jsxDEV, Fragment, };
