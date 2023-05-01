import { SYMBOL_CLONE } from '../constants.js';
;
export const wrapCloneElement = (target, component, props) => {
    target[SYMBOL_CLONE] = { component, props };
    return target;
};
