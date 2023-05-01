/* IMPORT */
import { switch as _switch } from '../oby.js';
import { assign, castArray } from '../utils/lang.js';
/* MAIN */
//TODO: Enforce children of Switch to be of type Switch.Case or Switch.Default
//TODO: Support function-form children
const Switch = ({ when, fallback, children }) => {
    const childrenWithValues = castArray(children); //TSC
    const values = childrenWithValues.map(child => child().metadata);
    return _switch(when, values, fallback); //TSC
};
/* UTILITIES */
Switch.Case = ({ when, children }) => {
    const metadata = { metadata: [when, children] };
    return assign(() => children, metadata);
};
Switch.Default = ({ children }) => {
    const metadata = { metadata: [children] };
    return assign(() => children, metadata);
};
/* EXPORT */
export default Switch;
