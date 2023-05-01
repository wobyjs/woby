/* IMPORT */
import { SYMBOL_OBSERVABLE_FROZEN, SYMBOL_UNCACHED, SYMBOL_UNTRACKED_UNWRAPPED } from '../constants.js';
import useReaction from '../hooks/use_reaction.js';
import isObservable from '../methods/is_observable.js';
import $$ from '../methods/SS.js';
import { createText } from './creators.js';
import { isArray, isFunction, isString } from './lang.js';
/* MAIN */
const resolveChild = (value, setter, _dynamic = false) => {
    if (isFunction(value)) {
        if (SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value) {
            resolveChild(value(), setter, _dynamic);
        }
        else {
            useReaction(() => {
                resolveChild(value(), setter, true);
            });
        }
    }
    else if (isArray(value)) {
        const [values, hasObservables] = resolveArraysAndStatics(value);
        values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED]; // Preserving this special symbol
        setter(values, hasObservables || _dynamic);
    }
    else {
        setter(value, _dynamic);
    }
};
const resolveClass = (classes, resolved = {}) => {
    if (isString(classes)) {
        classes.split(/\s+/g).filter(Boolean).filter(cls => {
            resolved[cls] = true;
        });
    }
    else if (isFunction(classes)) {
        resolveClass(classes(), resolved);
    }
    else if (isArray(classes)) {
        classes.forEach(cls => {
            resolveClass(cls, resolved); //TSC
        });
    }
    else if (classes) {
        for (const key in classes) {
            const value = classes[key];
            const isActive = !!$$(value);
            if (!isActive)
                continue;
            resolved[key] = true;
        }
    }
    return resolved;
};
const resolveArraysAndStatics = (() => {
    // This function does 3 things:
    // 1. It deeply flattens the array, only if actually needed though (!)
    // 2. It resolves statics, it's important to resolve them soon enough or they will be re-created multiple times (!)
    // 3. It checks if we found any Observables along the way, avoiding looping over the array another time in the future
    const DUMMY_RESOLVED = [];
    const resolveArraysAndStaticsInner = (values, resolved, hasObservables) => {
        for (let i = 0, l = values.length; i < l; i++) {
            const value = values[i];
            const type = typeof value;
            if (type === 'string' || type === 'number' || type === 'bigint') { // Static
                if (resolved === DUMMY_RESOLVED)
                    resolved = values.slice(0, i);
                resolved.push(createText(value));
            }
            else if (type === 'object' && isArray(value)) { // Array
                if (resolved === DUMMY_RESOLVED)
                    resolved = values.slice(0, i);
                hasObservables = resolveArraysAndStaticsInner(value, resolved, hasObservables)[1];
            }
            else if (type === 'function' && isObservable(value)) { // Observable
                if (resolved !== DUMMY_RESOLVED)
                    resolved.push(value);
                hasObservables = true;
            }
            else { // Something else
                if (resolved !== DUMMY_RESOLVED)
                    resolved.push(value);
            }
        }
        if (resolved === DUMMY_RESOLVED)
            resolved = values;
        return [resolved, hasObservables];
    };
    return (values) => {
        return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false);
    };
})();
/* EXPORT */
export { resolveChild, resolveClass, resolveArraysAndStatics };
