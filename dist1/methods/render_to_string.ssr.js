/* IMPORT */
import { setChild } from '../utils/setters.ssr.js';
export const renderToString = (child) => {
    const p = { children: null };
    setChild(p, child);
    return p.children.flat(Infinity).join('');
};
export default renderToString;
