/* IMPORT */
import useRoot from '../hooks/use_root.js';
import { setChild } from '../utils/setters.js';
/* MAIN */
const render = (child, parent) => {
    if (!parent || !(parent instanceof HTMLElement))
        throw new Error('Invalid parent node');
    parent.textContent = '';
    return useRoot(dispose => {
        setChild(parent, child);
        return () => {
            dispose();
            parent.textContent = '';
        };
    });
};
/* EXPORT */
export default render;
