/* IMPORT */

import useRoot from '../hooks/use_root';
import { setChild } from '../utils/setters';
import type { Child, Disposer, IntrinsicElementsMap } from '../types';
import $ from './S';
// import { JSX } from 'src/jsx/types';

export const render = (child: JSX.Child) => {
    const fragment = document.createElement('div');
    const renderDiv = document.createElement("div")
    // const buildTable = (div)=>{
    //     var table = document.createElement("table")
    //     var tr = document.createElement('tr');
    //     var td = document.createElement('td');

    //     td.append("Test Case")
    //     tr.append(td)
    //     table.append(tr)
    //     div.append(table)

    // }
    fragment.textContent = '';

    let disposer;
    let unmount = useRoot(dispose => {
        setChild(fragment as any, child);
        // fragment.appendChild(child);

        renderDiv.append(fragment)
        console.log('f', fragment.outerHTML);
        console.log('c', (fragment.children[0] as any).outerHTML);

        return disposer = (): void => {
            dispose();
            fragment.textContent = '';
            fragment.remove()

            console.log('dispose')
        };
    });
    document.body.append(renderDiv)

    const getByRole = <K extends keyof IntrinsicElementsMap>(tag: K) => fragment.querySelector(tag) as any as IntrinsicElementsMap[K];
    const getByTestId = <T extends HTMLElement = HTMLElement>(id: string) => {
        if(fragment.querySelector(`[data-testid="${id}"]`) as T){
            return fragment.querySelector(`[data-testid="${id}"]`) as T;
        }
        else{
            throw new Error("Element test ID not found ");
        }
    }

    const getByText = <T extends HTMLElement = HTMLElement>(text: string | RegExp) => {
        function allDescendants(node) {
            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                if (typeof text === "string") {
                    if (child.textContent == text) {
                        return child as T
                    }
                }
                else {
                    if (text.test(child.textContent)) {
                        return child as T
                    }
                }
                const returnValue = allDescendants(child);
                if (returnValue) {
                    return returnValue
                }
            }
            return null
        }
        const returnValue = allDescendants(fragment)
        if (!returnValue) {
            throw new Error("Element not found");
        }
    }
    return { fragment, unmount, getByRole, getByTestId, getByText };
};


