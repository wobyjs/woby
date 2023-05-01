/* IMPORT */
import useRoot from '../hooks/use_root.js';
import { isFunction } from '../utils/lang.js';
import { setChild } from '../utils/setters.via.js';
/* MAIN */
const render = (child, parent) => {
    if (!parent || !(parent[Symbol.for("__isProxy")]))
        throw new Error('Invalid parent node');
    parent.textContent = '';
    return useRoot(dispose => {
        setChild(parent, child);
        return () => {
            if (isFunction(dispose))
                dispose();
            parent.textContent = '';
        };
    });
};
/* EXPORT */
export default render;
