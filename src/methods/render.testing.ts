/* IMPORT */

import useRoot from '../hooks/use_root';
import { setChild } from '../utils/setters';
import type { Child, Disposer } from '../types';

// import { render as rd, $, } from 'voby';

export const render = (child: Child) => {
    const fragment = document.createDocumentFragment()

    fragment.textContent = '';

    let c: Element | Element[];

    let disposer;
    useRoot(dispose => {

        c = setChild(fragment as any, child);

        return disposer = (): void => {
            dispose();
            fragment.textContent = '';
        };
    });

    const unmount = () => {
        if (Array.isArray(c))
            c.forEach(c => fragment.removeChild(c));
        else
            fragment.removeChild(c);
    };
    const getByRole = <K extends keyof IntrinsicElementsMap>(tag: K) => fragment.querySelector(tag) as any as IntrinsicElementsMap[K];
    const getByTestId = <T extends HTMLElement = HTMLElement>(id: string) => fragment.querySelector(`[data-testid="${id}"]`) as T;

    return { fragment, unmount, getByRole, getByTestId };
};


