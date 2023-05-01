/* IMPORT */
import useTruthy from '../hooks/use_truthy.js';
import { ternary, untrack } from '../oby.js';
import { isFunction } from '../utils/lang.js';
/* MAIN */
const If = ({ when, fallback, children }) => {
    if (isFunction(children) && children.length) { // Calling the children function with an (() => Truthy<T>)
        const truthy = useTruthy(when);
        return ternary(when, () => untrack(() => children(truthy)), fallback);
    }
    else { // Just passing the children along
        return ternary(when, () => untrack(children), fallback); //TSC
    }
};
/* EXPORT */
export default If;
