/* IMPORT */

import useRoot from '../hooks/use_root';
import { setChild } from '../utils/setters';
import type { Child, Disposer } from '../types';
import $ from './S';

export const render = (child: Element) => {
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
    const getByTestId = <T extends HTMLElement = HTMLElement>(id: string) => fragment.querySelector(`[data-testid="${id}"]`) as T;
 
    return { fragment, unmount, getByRole, getByTestId };
};


