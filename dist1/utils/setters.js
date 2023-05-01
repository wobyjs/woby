/* IMPORT */
import { DIRECTIVE_OUTSIDE_SUPER_ROOT, HMR, SYMBOLS_DIRECTIVES, SYMBOL_UNCACHED } from '../constants.js';
import useMicrotask from '../hooks/use_microtask.js';
import useReaction from '../hooks/use_reaction.js';
import isObservable from '../methods/is_observable.js';
import isStore from '../methods/is_store.js';
import $$ from '../methods/SS.js';
import store from '../methods/store.js';
import untrack from '../methods/untrack.js';
import { context, with as _with } from '../oby.js';
import { SYMBOL_STORE_OBSERVABLE } from '../oby.js';
import { CallableAttributeStatic, CallableChildStatic, CallableClassStatic, CallableClassBooleanStatic, CallableEventStatic, CallablePropertyStatic, CallableStyleStatic, CallableStylesStatic } from './callables.js';
import { classesToggle } from './classlist.js';
import { createText, createComment } from './creators.js';
import diff from './diff.js';
import FragmentUtils from './fragment.js';
import { castArray, flatten, isArray, isBoolean, isFunction, isNil, isString, isSVG, isTemplateAccessor } from './lang.js';
import { resolveChild, resolveClass } from './resolvers.js';
/* MAIN */
const setAttributeStatic = (() => {
    const attributesBoolean = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'disabled', 'formnovalidate', 'hidden', 'indeterminate', 'ismap', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'seamless', 'selected']);
    const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/; //URL: https://regex101.com/r/I8Wm4S/1
    const attributesCache = {};
    const uppercaseRe = /[A-Z]/g;
    const normalizeKeySvg = (key) => {
        return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, char => `-${char.toLowerCase()}`));
    };
    return (element, key, value) => {
        if (isSVG(element)) {
            key = (key === 'xlinkHref' || key === 'xlink:href') ? 'href' : normalizeKeySvg(key);
            if (isNil(value) || (value === false && attributesBoolean.has(key))) {
                element.removeAttribute(key);
            }
            else {
                element.setAttribute(key, String(value));
            }
        }
        else {
            if (isNil(value) || (value === false && attributesBoolean.has(key))) {
                element.removeAttribute(key);
            }
            else {
                value = (value === true) ? '' : String(value);
                element.setAttribute(key, value);
            }
        }
    };
})();
const setAttribute = (element, key, value) => {
    if (isFunction(value)) {
        if (isObservable(value)) {
            new CallableAttributeStatic(value, element, key);
        }
        else {
            useReaction(() => {
                setAttributeStatic(element, key, value());
            });
        }
    }
    else {
        setAttributeStatic(element, key, value);
    }
};
const setChildReplacementFunction = (parent, fragment, child) => {
    if (isObservable(child)) {
        new CallableChildStatic(child, parent, fragment);
    }
    else {
        useReaction(() => {
            let valueNext = child();
            while (isFunction(valueNext)) {
                valueNext = valueNext();
            }
            setChildStatic(parent, fragment, valueNext, true);
        });
    }
};
const setChildReplacementText = (child, childPrev) => {
    if (childPrev.nodeType === 3) {
        childPrev.nodeValue = child;
        return childPrev;
    }
    else {
        const parent = childPrev.parentElement;
        if (!parent)
            throw new Error('Invalid child replacement');
        const textNode = createText(child);
        parent.replaceChild(textNode, childPrev);
        return textNode;
    }
};
const setChildReplacement = (child, childPrev) => {
    const type = typeof child;
    if (type === 'string' || type === 'number' || type === 'bigint') {
        setChildReplacementText(String(child), childPrev);
    }
    else {
        const parent = childPrev.parentElement;
        if (!parent)
            throw new Error('Invalid child replacement');
        const fragment = FragmentUtils.makeWithNode(childPrev);
        if (type === 'function') {
            setChildReplacementFunction(parent, fragment, child); //TSC
        }
        else {
            setChild(parent, child, fragment);
        }
    }
};
const setChildStatic = (parent, fragment, child, dynamic) => {
    if (!dynamic && child === undefined)
        return; // Ignoring static undefined children, avoiding inserting some useless placeholder nodes
    const prev = FragmentUtils.getChildren(fragment);
    const prevIsArray = (prev instanceof Array);
    const prevLength = prevIsArray ? prev.length : 1;
    const prevFirst = prevIsArray ? prev[0] : prev;
    const prevLast = prevIsArray ? prev[prevLength - 1] : prev;
    const prevSibling = prevLast?.nextSibling || null;
    if (prevLength === 0) { // Fast path for appending a node the first time
        const type = typeof child;
        if (type === 'string' || type === 'number' || type === 'bigint') {
            const textNode = createText(child);
            parent.appendChild(textNode);
            FragmentUtils.replaceWithNode(fragment, textNode);
            return;
        }
        else if (type === 'object' && child !== null && typeof child.nodeType === 'number') { //TSC
            const node = child;
            parent.insertBefore(node, null);
            FragmentUtils.replaceWithNode(fragment, node);
            return;
        }
    }
    if (prevLength === 1) { // Fast path for single text child
        const type = typeof child;
        if (type === 'string' || type === 'number' || type === 'bigint') {
            const node = setChildReplacementText(String(child), prevFirst);
            FragmentUtils.replaceWithNode(fragment, node);
            return;
        }
    }
    const fragmentNext = FragmentUtils.make();
    const children = (Array.isArray(child) ? child : [child]); //TSC
    let nextHasStaticChildren = false;
    for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i];
        const type = typeof child;
        if (type === 'string' || type === 'number' || type === 'bigint') {
            nextHasStaticChildren = true;
            FragmentUtils.pushNode(fragmentNext, createText(child));
        }
        else if (type === 'object' && child !== null && typeof child.nodeType === 'number') {
            nextHasStaticChildren = true;
            FragmentUtils.pushNode(fragmentNext, child);
        }
        else if (type === 'function') {
            const fragment = FragmentUtils.make();
            FragmentUtils.pushFragment(fragmentNext, fragment);
            resolveChild(child, setChildStatic.bind(undefined, parent, fragment));
        }
    }
    let next = FragmentUtils.getChildren(fragmentNext);
    let nextLength = fragmentNext.length;
    let nextHasDynamicChildren = !nextHasStaticChildren && nextLength > 0; // Just a heuristic, not exact, good enough
    if (nextLength === 0 && prevLength === 1 && prevFirst.nodeType === 8) { // It's a placeholder already, no need to replace it
        return;
    }
    if (nextLength === 0 || (prevLength === 1 && prevFirst.nodeType === 8) || children[SYMBOL_UNCACHED]) { // Fast path for removing all children and/or replacing the placeholder
        const { childNodes } = parent;
        if (childNodes.length === prevLength) { // Maybe this fragment doesn't handle all children but only a range of them, checking for that here
            parent.textContent = '';
            if (nextLength === 0) { // Placeholder, to keep the right spot in the array of children
                const placeholder = createComment('');
                FragmentUtils.pushNode(fragmentNext, placeholder);
                if (next !== fragmentNext.values) {
                    next = placeholder;
                    nextLength += 1;
                }
            }
            if (prevSibling) {
                if (next instanceof Array) {
                    prevSibling.before.apply(prevSibling, next);
                }
                else {
                    parent.insertBefore(next, prevSibling);
                }
            }
            else {
                if (next instanceof Array) {
                    parent.append.apply(parent, next);
                }
                else {
                    parent.append(next);
                }
            }
            FragmentUtils.replaceWithFragment(fragment, fragmentNext);
            return;
        }
    }
    if (nextLength === 0) { // Placeholder, to keep the right spot in the array of children
        const placeholder = createComment('');
        FragmentUtils.pushNode(fragmentNext, placeholder);
        if (next !== fragmentNext.values) {
            next = placeholder;
            nextLength += 1;
        }
    }
    if (prevLength > 0 || nextHasStaticChildren || !nextHasDynamicChildren) { // Some diffs can be safely skipped, if we only added some dynamic children already //FIXME: Children added dynamically must be taken into account perfectly though, this most probably isn't perfect, "prev" may not be representative of the current state, when dynamic children are added
        try {
            diff(parent, prev, next, prevSibling);
        }
        catch (error) {
            if (HMR) { // Suppressing error during HMR, to try to keep the page working
                console.error(error);
            }
            else {
                throw error;
            }
        }
    }
    FragmentUtils.replaceWithFragment(fragment, fragmentNext);
};
const setChild = (parent, child, fragment = FragmentUtils.make()) => {
    resolveChild(child, setChildStatic.bind(undefined, parent, fragment));
};
const setClassStatic = classesToggle;
const setClass = (element, key, value) => {
    if (isFunction(value)) {
        if (isObservable(value)) {
            new CallableClassStatic(value, element, key);
        }
        else {
            useReaction(() => {
                setClassStatic(element, key, value());
            });
        }
    }
    else {
        setClassStatic(element, key, value);
    }
};
const setClassBooleanStatic = (element, value, key, keyPrev) => {
    if (keyPrev && keyPrev !== true) {
        setClassStatic(element, keyPrev, false);
    }
    if (key && key !== true) {
        setClassStatic(element, key, value);
    }
};
const setClassBoolean = (element, value, key) => {
    if (isFunction(key)) {
        if (isObservable(key)) {
            new CallableClassBooleanStatic(key, element, value);
        }
        else {
            let keyPrev;
            useReaction(() => {
                const keyNext = key();
                setClassBooleanStatic(element, value, keyNext, keyPrev);
                keyPrev = keyNext;
            });
        }
    }
    else {
        setClassBooleanStatic(element, value, key);
    }
};
const setClassesStatic = (element, object, objectPrev) => {
    if (isString(object)) {
        if (isSVG(element)) {
            element.setAttribute('class', object);
        }
        else {
            element.className = object;
        }
    }
    else {
        if (objectPrev) {
            if (isString(objectPrev)) {
                if (objectPrev) {
                    if (isSVG(element)) {
                        element.setAttribute('class', '');
                    }
                    else {
                        element.className = '';
                    }
                }
            }
            else if (isArray(objectPrev)) {
                objectPrev = store.unwrap(objectPrev);
                for (let i = 0, l = objectPrev.length; i < l; i++) {
                    if (!objectPrev[i])
                        continue;
                    setClassBoolean(element, false, objectPrev[i]);
                }
            }
            else {
                objectPrev = store.unwrap(objectPrev);
                for (const key in objectPrev) {
                    if (object && key in object)
                        continue;
                    setClass(element, key, false);
                }
            }
        }
        if (isArray(object)) {
            if (isStore(object)) {
                for (let i = 0, l = object.length; i < l; i++) {
                    const fn = untrack(() => isFunction(object[i]) ? object[i] : object[SYMBOL_STORE_OBSERVABLE](String(i))); //TSC
                    setClassBoolean(element, true, fn);
                }
            }
            else {
                for (let i = 0, l = object.length; i < l; i++) {
                    if (!object[i])
                        continue;
                    setClassBoolean(element, true, object[i]);
                }
            }
        }
        else {
            if (isStore(object)) {
                for (const key in object) {
                    const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key)); //TSC
                    setClass(element, key, fn);
                }
            }
            else {
                for (const key in object) {
                    setClass(element, key, object[key]);
                }
            }
        }
    }
};
const setClasses = (element, object) => {
    /* RECURSIVE IMPLEMENTATION */
    if (isFunction(object) || isArray(object)) {
        let objectPrev;
        useReaction(() => {
            const objectNext = resolveClass(object);
            setClassesStatic(element, objectNext, objectPrev);
            objectPrev = objectNext;
        });
    }
    else {
        setClassesStatic(element, object);
    }
    /* REGULAR IMPLEMENTATION */
    // if ( isFunction ( object ) ) {
    //   if ( isObservable ( object ) ) {
    //     new CallableClassesStatic ( object, element );
    //   } else {
    //     let objectPrev: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>;
    //     useReaction ( () => {
    //       const objectNext = object ();
    //       setClassesStatic ( element, objectNext, objectPrev );
    //       objectPrev = objectNext;
    //     });
    //   }
    // } else {
    //   setClassesStatic ( element, object );
    // }
};
const setDirective = (() => {
    const runWithSuperRoot = _with();
    return (element, directive, args) => {
        const symbol = SYMBOLS_DIRECTIVES[directive] || Symbol();
        const data = DIRECTIVE_OUTSIDE_SUPER_ROOT.current ? context(symbol) : runWithSuperRoot(() => context(symbol));
        if (!data)
            throw new Error(`Directive "${directive}" not found`);
        const call = () => data.fn(element, ...castArray(args)); //TSC
        if (data.immediate) {
            call();
        }
        else {
            useMicrotask(call);
        }
    };
})();
const setEventStatic = (() => {
    //TODO: Maybe delegate more events: [onmousemove, onmouseout, onmouseover, onpointerdown, onpointermove, onpointerout, onpointerover, onpointerup, ontouchend, ontouchmove, ontouchstart]
    const delegatedEvents = {
        onauxclick: ['_onauxclick', false],
        onbeforeinput: ['_onbeforeinput', false],
        onclick: ['_onclick', false],
        ondblclick: ['_ondblclick', false],
        onfocusin: ['_onfocusin', false],
        onfocusout: ['_onfocusout', false],
        oninput: ['_oninput', false],
        onkeydown: ['_onkeydown', false],
        onkeyup: ['_onkeyup', false],
        onmousedown: ['_onmousedown', false],
        onmouseup: ['_onmouseup', false]
    };
    const delegate = (event) => {
        const key = `_${event}`;
        document.addEventListener(event.slice(2), event => {
            const targets = event.composedPath();
            let target = null;
            Object.defineProperty(event, 'currentTarget', {
                configurable: true,
                get() {
                    return target;
                }
            });
            for (let i = 0, l = targets.length; i < l; i++) {
                target = targets[i];
                const handler = target[key];
                if (!handler)
                    continue;
                handler(event);
                if (event.cancelBubble)
                    break;
            }
            target = null;
        });
    };
    return (element, event, value) => {
        const delegated = delegatedEvents[event];
        if (delegated) {
            if (!delegated[1]) { // Not actually delegating yet
                delegated[1] = true;
                delegate(event);
            }
            element[delegated[0]] = value;
        }
        else if (event.endsWith('passive')) {
            const isCapture = event.endsWith('capturepassive');
            const type = event.slice(2, -7 - (isCapture ? 7 : 0));
            const key = `_${event}`;
            const valuePrev = element[key];
            if (valuePrev)
                element.removeEventListener(type, valuePrev, { capture: isCapture });
            if (value)
                element.addEventListener(type, value, { passive: true, capture: isCapture });
            element[key] = value;
        }
        else if (event.endsWith('capture')) {
            const type = event.slice(2, -7);
            const key = `_${event}`;
            const valuePrev = element[key];
            if (valuePrev)
                element.removeEventListener(type, valuePrev, { capture: true });
            if (value)
                element.addEventListener(type, value, { capture: true });
            element[key] = value;
        }
        else {
            element[event] = value;
        }
    };
})();
const setEvent = (element, event, value) => {
    if (isObservable(value)) {
        new CallableEventStatic(value, element, event);
    }
    else {
        setEventStatic(element, event, value);
    }
};
const setHTMLStatic = (element, value) => {
    element.innerHTML = String(isNil(value) ? '' : value);
};
const setHTML = (element, value) => {
    useReaction(() => {
        setHTMLStatic(element, $$($$(value).__html));
    });
};
const setPropertyStatic = (element, key, value) => {
    if (key === 'tabIndex' && isBoolean(value)) {
        value = value ? 0 : undefined;
    }
    if (key === 'value' && element.tagName === 'SELECT' && !element['_$inited']) {
        element['_$inited'] = true;
        queueMicrotask(() => element[key] = value);
    }
    element[key] = value;
    if (isNil(value)) {
        setAttributeStatic(element, key, null);
    }
};
const setProperty = (element, key, value) => {
    if (isFunction(value)) {
        if (isObservable(value)) {
            new CallablePropertyStatic(value, element, key);
        }
        else {
            useReaction(() => {
                setPropertyStatic(element, key, value());
            });
        }
    }
    else {
        setPropertyStatic(element, key, value);
    }
};
const setRef = (element, value) => {
    if (isNil(value))
        return;
    const values = flatten(castArray(value));
    useMicrotask(() => values.forEach(value => value?.(element)));
};
const setStyleStatic = (() => {
    // From Preact: https://github.com/preactjs/preact/blob/e703a62b77c9de45e886d8a7f59bd0db658318f9/src/constants.js#L3
    // const propertyNonDimensionalRe = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    // From this Preact issue: https://github.com/preactjs/preact/issues/2607
    const propertyNonDimensionalRe = /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/i;
    const propertyNonDimensionalCache = {};
    return (element, key, value) => {
        if (key.charCodeAt(0) === 45) { // /^-/
            if (isNil(value)) {
                element.style.removeProperty(key);
            }
            else {
                element.style.setProperty(key, String(value));
            }
        }
        else if (isNil(value)) {
            element.style[key] = null;
        }
        else {
            element.style[key] = (isString(value) || (propertyNonDimensionalCache[key] || (propertyNonDimensionalCache[key] = propertyNonDimensionalRe.test(key))) ? value : `${value}px`);
        }
    };
})();
const setStyle = (element, key, value) => {
    if (isFunction(value)) {
        if (isObservable(value)) {
            new CallableStyleStatic(value, element, key);
        }
        else {
            useReaction(() => {
                setStyleStatic(element, key, value());
            });
        }
    }
    else {
        setStyleStatic(element, key, value);
    }
};
const setStylesStatic = (element, object, objectPrev) => {
    if (isString(object)) {
        element.setAttribute('style', object);
    }
    else {
        if (objectPrev) {
            if (isString(objectPrev)) {
                if (objectPrev) {
                    element.style.cssText = '';
                }
            }
            else {
                objectPrev = store.unwrap(objectPrev);
                for (const key in objectPrev) {
                    if (object && key in object)
                        continue;
                    setStyleStatic(element, key, null);
                }
            }
        }
        if (isStore(object)) {
            for (const key in object) {
                const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key)); //TSC
                setStyle(element, key, fn);
            }
        }
        else {
            for (const key in object) {
                setStyle(element, key, object[key]);
            }
        }
    }
};
const setStyles = (element, object) => {
    if (isFunction(object)) {
        if (isObservable(object)) {
            new CallableStylesStatic(object, element);
        }
        else {
            let objectPrev;
            useReaction(() => {
                const objectNext = object();
                setStylesStatic(element, objectNext, objectPrev);
                objectPrev = objectNext;
            });
        }
    }
    else {
        setStylesStatic(element, object);
    }
};
const setTemplateAccessor = (element, key, value) => {
    if (key === 'children') {
        const placeholder = createText(''); // Using a Text node rather than a Comment as the former may be what we actually want ultimately
        element.insertBefore(placeholder, null);
        value(element, 'setChildReplacement', undefined, placeholder);
    }
    else if (key === 'ref') {
        value(element, 'setRef');
    }
    else if (key === 'style') {
        value(element, 'setStyles');
    }
    else if (key === 'class' || key === 'className') {
        if (!isSVG(element)) {
            element.className = ''; // Ensuring the attribute is present
        }
        value(element, 'setClasses');
    }
    else if (key === 'dangerouslySetInnerHTML') {
        value(element, 'setHTML');
    }
    else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) { // /^on/
        value(element, 'setEvent', key.toLowerCase());
    }
    else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) { // /^u..:/
        value(element, 'setDirective', key.slice(4));
    }
    else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' /* || key === 'className' */) {
        // Forbidden props
    }
    else if (key in element && !isSVG(element)) {
        value(element, 'setProperty', key);
    }
    else {
        element.setAttribute(key, ''); // Ensuring the attribute is present
        value(element, 'setAttribute', key);
    }
};
const setProp = (element, key, value) => {
    if (isTemplateAccessor(value)) {
        setTemplateAccessor(element, key, value);
    }
    else if (key === 'children') {
        setChild(element, value);
    }
    else if (key === 'ref') {
        setRef(element, value);
    }
    else if (key === 'style') {
        setStyles(element, value);
    }
    else if (key === 'class' || key === 'className') {
        setClasses(element, value);
    }
    else if (key === 'dangerouslySetInnerHTML') {
        setHTML(element, value);
    }
    else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) { // /^on/
        setEvent(element, key.toLowerCase(), value);
    }
    else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) { // /^u..:/
        setDirective(element, key.slice(4), value);
    }
    else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' /* || key === 'className' */) {
        // Forbidden props
    }
    else if (key in element && !isSVG(element)) {
        setProperty(element, key, value);
    }
    else {
        setAttribute(element, key, value);
    }
};
const setProps = (element, object) => {
    for (const key in object) {
        setProp(element, key, object[key]);
    }
};
/* EXPORT */
export { setAttributeStatic, setAttribute, setChildReplacementFunction, setChildReplacementText, setChildReplacement, setChildStatic, setChild, setClassStatic, setClass, setClassBooleanStatic, setClassesStatic, setClasses, setEventStatic, setEvent, setHTMLStatic, setHTML, setPropertyStatic, setProperty, setRef, setStyleStatic, setStyle, setStylesStatic, setStyles, setTemplateAccessor, setProp, setProps };
