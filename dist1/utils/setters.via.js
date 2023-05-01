/* IMPORT */
import { DIRECTIVE_OUTSIDE_SUPER_ROOT, SYMBOLS_DIRECTIVES } from '../constants.js';
import useMicrotask from '../hooks/use_microtask.js';
import useReaction from '../hooks/use_reaction.js';
import isObservable from '../methods/is_observable.js';
import isStore from '../methods/is_store.js';
import $$ from '../methods/SS.js';
import store from '../methods/store.js';
import untrack from '../methods/untrack.js';
import { context, with as _with } from 'oby';
import { SYMBOL_STORE_OBSERVABLE } from 'oby';
import { CallableAttributeStatic, CallableClassStatic, CallableClassBooleanStatic, CallableEventStatic, CallablePropertyStatic, CallableStyleStatic, CallableStylesStatic } from './callables.via.js';
import { classesToggle } from './classlist.js';
import { createText } from './creators.js';
import { castArray, flatten, isArray, isBoolean, isFunction, isNil, isString, isSVG, isTemplateAccessor } from './lang.js';
import { resolveChild, resolveClass } from './resolvers.via.js';
// import createElement from '../methods/create_element.via.js'
/* MAIN */
const debugHTML = (p, name) => {
    if (p)
        (async () => {
            const nn = await get(p.nodeName);
            const nt = await get(p.nodeType);
            const html = await get(p.outerHTML);
            console.log(name, p, nn, nt, html);
        })();
};
const setAttributeStatic = (() => {
    const attributesBoolean = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'disabled', 'formnovalidate', 'hidden', 'indeterminate', 'ismap', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'seamless', 'selected']);
    // const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/ //URL: https://regex101.com/r/I8Wm4S/1
    // const attributesCache: Record<string, string> = {}
    // const uppercaseRe = /[A-Z]/g
    // const normalizeKeySvg = (key: string): string => {
    //     return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, char => `-${char.toLowerCase()}`))
    // }
    return (element, key, value) => {
        // put in via
        // if (isSVG(element) && !isProxy(element)) {
        //     key = (key === 'xlinkHref' || key === 'xlink:href') ? 'href' : normalizeKeySvg(key)
        //     if (isNil(value) || ((value === false) && attributesBoolean.has(key))) {
        //         element.removeAttribute(key)
        //     } else {
        //         element.setAttribute(key, String(value))
        //     }
        // } else {
        if (isNil(value) || (value === false && attributesBoolean.has(key))) {
            element.removeAttribute(key);
        }
        else {
            value = (value === true) ? '' : String(value);
            element.setAttribute(key, value);
        }
        // }
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
const setChildStatic = (parent, child, dynamic) => {
    if (!dynamic && child === undefined)
        return; // Ignoring static undefined children, avoiding inserting some useless placeholder nodes
    if (Array.isArray(child)) {
        const children = (Array.isArray(child) ? child : [child]); //TSC
        const cs = children.map(c => resolveChild(c)).flat(Infinity);
        parent.replaceChildren(...cs);
    }
    else {
        const c = resolveChild(child);
        // debugHTML(parent, "setChildStatic")
        //@ts-ignore
        parent.replaceChildren(...[c].flat(Infinity));
    }
};
const setChild = (parent, child) => {
    setChildStatic(parent, child);
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
                objectPrev = store(objectPrev, { unwrap: true });
                for (let i = 0, l = objectPrev.length; i < l; i++) {
                    if (!objectPrev[i])
                        continue;
                    setClassBoolean(element, false, objectPrev[i]);
                }
            }
            else {
                objectPrev = store(objectPrev, { unwrap: true });
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
        //@ts-ignore
        const call = () => data.fn(element, ...castArray(args)); //TSC
        //@ts-ignore
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
    // const delegatedEvents = <const>{
    //     onauxclick: ['_onauxclick', false],
    //     onbeforeinput: ['_onbeforeinput', false],
    //     onclick: ['_onclick', false],
    //     ondblclick: ['_ondblclick', false],
    //     onfocusin: ['_onfocusin', false],
    //     onfocusout: ['_onfocusout', false],
    //     oninput: ['_oninput', false],
    //     onkeydown: ['_onkeydown', false],
    //     onkeyup: ['_onkeyup', false],
    //     onmousedown: ['_onmousedown', false],
    //     onmouseup: ['_onmouseup', false]
    // }
    // const delegate = (event: string): void => {
    //     const key = `_${event}`
    //     via.document.addEventListener(event.slice(2), async event => {
    //         const targets = event.composedPath()
    //         const target = targets[0] || document
    //         Object.defineProperty(event, 'currentTarget', {
    //             configurable: true,
    //             get() {
    //                 return target
    //             }
    //         })
    //         for (let i = 0, l = targets.length; i < l; i++) {
    //             const handler = targets[i][key]
    //             if (!handler) continue
    //             handler(event)
    //             if (event.cancelBubble) break
    //         }
    //     })
    // }
    return (element, event, value) => {
        // const delegated = delegatedEvents[event]
        // if (delegated) {
        //     if (!delegated[1]) { // Not actually delegating yet
        //         delegated[1] = true
        //         delegate(event)
        //     }
        //     element[delegated[0]] = value
        // } else
        // if (event.endsWith('passive')) {
        //     const isCapture = event.endsWith('capturepassive')
        //     const type = event.slice(0, -7 - (isCapture ? 7 : 0)) //on already chopped
        //     const key = `_${event}`
        //     if (preId) {
        //         const valuePrev = self.Via.getIdToCallback(preId)
        //         element.removeEventListener(type, valuePrev as any, { capture: isCapture })
        //     }
        //     if (value) {
        //         const f = element.addEventListener
        //         f(type, value, { passive: true, capture: isCapture })
        //         preId = f[__ArgsSymbol][1]
        //     }
        //     element[key] = value
        // } else if (event.endsWith('capture')) {
        //     const type = event.slice(0, -7) //on already chopped
        //     const key = `_${event}`
        //     if (preId) {
        //         console.log('removeEventListener preId ', preId)
        //         const valuePrev = self.Via.getIdToCallback(preId)
        //         element.removeEventListener(type, valuePrev as any, { capture: true })
        //     }
        //     if (value) {
        //         const f = element.addEventListener
        //         f(type, value, { capture: true })
        //         preId = f[__ArgsSymbol][1]
        //     }
        //     element[key] = value
        // } else {
        //     if (preId) {
        //         const valuePrev = self.Via.getIdToCallback(preId)
        //         element.removeEventListener(event, valuePrev as any)
        //     }
        //     if (value) {
        //         const f = element.addEventListener
        //         f(event, value)
        //         preId = f[__ArgsSymbol][1]
        //     }
        //     element[event] = value
        // }
        // const valuePrev = element[event]
        // if (valuePrev) element.removeEventListener(event, valuePrev)
        // if (value) element.addEventListener(event, value)
        element[event] = value;
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
    // if (isNil(value)) {
    //     setAttributeStatic(element, key, null)
    // }
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
            if (isNil(value))
                element.style.removeProperty(key);
            else
                element.style.setProperty(key, String(value));
        }
        else if (isNil(value))
            element.style[key] = null;
        else
            element.style[key] = (isString(value) || (propertyNonDimensionalCache[key] || (propertyNonDimensionalCache[key] = propertyNonDimensionalRe.test(key))) ? value : `${value}px`);
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
                objectPrev = store(objectPrev, { unwrap: true });
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
const setTemplateAccessor = async (element, key, value) => {
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
    if (isTemplateAccessor(value))
        setTemplateAccessor(element, key, value);
    else if (key === 'children')
        setChild(element, value);
    else if (key === 'ref')
        setRef(element, value);
    else if (key === 'style')
        setStyles(element, value);
    else if (key === 'class' || key === 'className')
        setClasses(element, value);
    else if (key === 'dangerouslySetInnerHTML')
        setHTML(element, value);
    else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) // /^on/
        setEvent(element, key.toLowerCase(), value);
    // $.root(() => element.addEventListener(key.substring(2).toLowerCase(), value as any))
    else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) // /^u..:/
        setDirective(element, key.slice(4), value);
    else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' /* || key === 'className' */) {
        // Forbidden props
    }
    else { //if (key in element && !isSVG(element))
        setProperty(element, key, value);
        // else
        setAttribute(element, key, value);
    }
};
const setProps = (element, object) => {
    const { children, ...pp } = object;
    //set children 1st, in case value refer to children
    // if (typeof children !== 'undefined')
    setProp(element, 'children', children);
    for (const key in pp)
        setProp(element, key, object[key]);
};
/* EXPORT */
export { setAttributeStatic, setAttribute, /* setChildReplacementFunction, */ /* setChildReplacementText, setChildReplacement, */ setChildStatic, setChild, setClassStatic, setClass, setClassBooleanStatic, setClassesStatic, setClasses, setEventStatic, setEvent, setHTMLStatic, setHTML, setPropertyStatic, setProperty, setRef, setStyleStatic, setStyle, setStylesStatic, setStyles, setTemplateAccessor, setProp, setProps };
