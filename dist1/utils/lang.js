/* IMPORT */
import { SYMBOL_TEMPLATE_ACCESSOR } from '../constants.js';
/* MAIN */
const { assign } = Object;
const castArray = (value) => {
    return isArray(value) ? value : [value];
};
const castError = (exception) => {
    if (isError(exception))
        return exception;
    if (isString(exception))
        return new Error(exception);
    return new Error('Unknown error');
};
const flatten = (arr) => {
    for (let i = 0, l = arr.length; i < l; i++) {
        if (!isArray(arr[i]))
            continue;
        return arr.flat(Infinity);
    }
    return arr;
};
const indexOf = (() => {
    const _indexOf = Array.prototype.indexOf;
    return (arr, value) => {
        return _indexOf.call(arr, value);
    };
})();
const { isArray } = Array;
const isBoolean = (value) => {
    return typeof value === 'boolean';
};
const isError = (value) => {
    return value instanceof Error;
};
const isFalsy = (value) => {
    return !value;
};
const isFunction = (value) => {
    return typeof value === 'function';
};
const isNil = (value) => {
    return value === null || value === undefined;
};
const isNode = (value) => {
    return value instanceof Node;
};
const isObject = (value) => {
    return typeof value === 'object' && value !== null;
};
const isPrimitive = (value) => {
    const t = typeof value;
    return !(t === 'object' || t === 'function');
};
const isPromise = (value) => {
    return value instanceof Promise;
};
const isProxy = (proxy) => {
    return proxy == null ? false : !!proxy[Symbol.for("__isProxy")];
};
const isString = (value) => {
    return typeof value === 'string';
};
const isSVG = (value) => {
    return !!value['isSVG'];
};
const isSVGElement = (() => {
    const svgRe = /^(t(ext$|s)|s[vwy]|g)|^set|tad|ker|p(at|s)|s(to|c$|ca|k)|r(ec|cl)|ew|us|f($|e|s)|cu|n[ei]|l[ty]|[GOP]/; //URL: https://regex101.com/r/Ck4kFp/1
    const svgCache = {};
    return (element) => {
        const cached = svgCache[element];
        return (cached !== undefined) ? cached : (svgCache[element] = !element.includes('-') && svgRe.test(element));
    };
})();
const isTemplateAccessor = (value) => {
    return isFunction(value) && (SYMBOL_TEMPLATE_ACCESSOR in value);
};
const isTruthy = (value) => {
    return !!value;
};
const isVoidChild = (value) => {
    return value === null || value === undefined || typeof value === 'boolean' || typeof value === 'symbol';
};
const noop = () => { };
const once = (fn) => {
    let called = false;
    let result;
    return () => {
        if (!called) {
            called = true;
            result = fn();
        }
        return result;
    };
};
export const fixBigInt = (v) => typeof v === 'bigint' ? v + 'n' : v;
export const toArray = (v) => [...[v].flat(Infinity)];
/* EXPORT */
export { assign, castArray, castError, flatten, indexOf, isArray, isBoolean, isError, isFalsy, isFunction, isNil, isNode, isObject, isPrimitive, isPromise, isProxy, isString, isSVG, isSVGElement, isTemplateAccessor, isTruthy, isVoidChild, noop, once };
