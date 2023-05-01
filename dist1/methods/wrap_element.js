/* IMPORT */
import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants.js';
/* MAIN */
const wrapElement = (element) => {
    element[SYMBOL_UNTRACKED_UNWRAPPED] = true;
    return element;
};
/* EXPORT */
export default wrapElement;
