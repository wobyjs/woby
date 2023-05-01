/* IMPORT */
import { ternary } from '../oby.js';
/* MAIN */
//TODO: Support function-form children
const Ternary = ({ when, children }) => {
    return ternary(when, children[0], children[1]);
};
/* EXPORT */
export default Ternary;
