/* IMPORT */
import useEffect from '../hooks/use_effect.js';
import render from '../methods/render.via.js';
import $$ from '../methods/SS.js';
import { boolean } from 'oby';
import { createHTMLNode } from '../utils/creators.via.js';
import { assign } from '../utils/lang.js';
/* MAIN */
const Portal = ({ when = true, mount, wrapper, children }) => {
    const portal = $$(wrapper) || createHTMLNode('div');
    if (!(portal instanceof HTMLElement))
        throw new Error('Invalid wrapper node');
    const condition = boolean(when);
    useEffect(() => {
        if (!$$(condition))
            return null;
        const parent = $$(mount) || document.body;
        if (!(parent instanceof Element))
            throw new Error('Invalid mount node');
        parent.insertBefore(portal, null);
        return () => {
            parent.removeChild(portal);
        };
    });
    useEffect(() => {
        if (!$$(condition))
            return null;
        return render(children, portal);
    });
    return assign(() => $$(condition) || children, { metadata: { portal } });
};
/* EXPORT */
export default Portal;
