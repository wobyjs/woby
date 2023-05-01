/* IMPORT */
import useMicrotask from '../hooks/use_microtask.js';
import useReaction from '../hooks/use_reaction.js';
import isObservable from '../methods/is_observable.js';
import isStore from '../methods/is_store.js';
import $$ from '../methods/SS.js';
import store from '../methods/store.js';
import untrack from '../methods/untrack.js';
import { SYMBOL_STORE_OBSERVABLE } from 'oby';
import { /* CallableAttributeStatic, */ CallableClassStatic, CallableClassBooleanStatic, CallablePropertyStatic, CallableStyleStatic, CallableStylesStatic } from './callables.ssr.js';
import { classesToggle } from './classlist.ssr.js';
import { castArray, flatten, isArray, isBoolean, isFunction, isNil, isString } from './lang.js';
import { resolveChild, resolveClass } from './resolvers.ssr.js';
/* MAIN */
// const setAttributeStatic = (() => {
//     const attributesBoolean = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'disabled', 'formnovalidate', 'hidden', 'indeterminate', 'ismap', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'seamless', 'selected'])
//     const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/ //URL: https://regex101.com/r/I8Wm4S/1
//     const attributesCache: Record<string, string> = {}
//     const uppercaseRe = /[A-Z]/g
//     const normalizeKeySvg = (key: string): string => {
//         return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, char => `-${char.toLowerCase()}`))
//     }
//     return <T, V>(props: T, key: string, value: V): void => {
//         if (isNil(value) || (value === false && attributesBoolean.has(key as any))) {
//             delete props[key]
//         } else {
//             value = ((value === true) ? '' : String(value)) as any
//             props[key] = value
//         }
//     }
// })()
// const setAttribute = <T, V>(props: T, key: string, value: FunctionMaybe<V>): void => {
//     if (isFunction(value)) {
//         if (isObservable(value)) {
//             new CallableAttributeStatic(value, props, key)
//         } else
//             useReaction(() => setAttributeStatic(props, key, value()))
//     } else
//         setAttributeStatic(props, key, value)
// }
const setChildStatic = (props, child, dynamic) => {
    if (!dynamic && child === undefined)
        return; // Ignoring static undefined children, avoiding inserting some useless placeholder nodes
    if (Array.isArray(child)) {
        const children = (Array.isArray(child) ? child : [child]); //TSC
        const cs = children.map(c => resolveChild(c)).flat(Infinity);
        props.children = cs;
    }
    else { //if (isProxy(child)) { //TSC
        const c = resolveChild(child);
        try {
            //@ts-ignore
            props.children = [c].flat(Infinity);
        }
        catch (error) {
            debugger;
        }
    }
};
const setChild = (props, child) => {
    setChildStatic(props, child);
};
const setClassStatic = classesToggle;
const setClass = (props, key, value) => {
    if (isFunction(value)) {
        if (isObservable(value))
            new CallableClassStatic(value, props, key);
        else
            useReaction(() => setClassStatic(props, key, value()));
    }
    else
        setClassStatic(props, key, value);
};
const setClassBooleanStatic = (props, value, key, keyPrev) => {
    if (keyPrev && keyPrev !== true)
        setClassStatic(props, keyPrev, false);
    if (key && key !== true)
        setClassStatic(props, key, value);
};
const setClassBoolean = (props, value, key) => {
    if (isFunction(key)) {
        if (isObservable(key))
            new CallableClassBooleanStatic(key, props, value);
        else {
            let keyPrev;
            useReaction(() => {
                const keyNext = key();
                setClassBooleanStatic(props, value, keyNext, keyPrev);
                keyPrev = keyNext;
            });
        }
    }
    else
        setClassBooleanStatic(props, value, key);
};
const setClassesStatic = (props, key, object, objectPrev) => {
    if (isString(object))
        props[key] = object;
    else {
        if (objectPrev) {
            if (isString(objectPrev)) {
                if (objectPrev)
                    props[key] = '';
            }
            else if (isArray(objectPrev)) {
                objectPrev = store(objectPrev, { unwrap: true });
                for (let i = 0, l = objectPrev.length; i < l; i++) {
                    if (!objectPrev[i])
                        continue;
                    setClassBoolean(props, false, objectPrev[i]);
                }
            }
            else {
                objectPrev = store(objectPrev, { unwrap: true });
                for (const key in objectPrev) {
                    if (object && key in object)
                        continue;
                    setClass(props, key, false);
                }
            }
        }
        if (isArray(object)) {
            if (isStore(object)) {
                for (let i = 0, l = object.length; i < l; i++) {
                    const fn = untrack(() => isFunction(object[i]) ? object[i] : object[SYMBOL_STORE_OBSERVABLE](String(i))); //TSC
                    setClassBoolean(props, true, fn);
                }
            }
            else {
                for (let i = 0, l = object.length; i < l; i++) {
                    if (!object[i])
                        continue;
                    setClassBoolean(props, true, object[i]);
                }
            }
        }
        else {
            if (isStore(object)) {
                for (const key in object) {
                    const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key)); //TSC
                    setClass(props, key, fn);
                }
            }
            else {
                for (const key in object) {
                    setClass(props, key, object[key]);
                }
            }
        }
    }
};
const setClasses = (props, key, object) => {
    /* RECURSIVE IMPLEMENTATION */
    if (isFunction(object) || isArray(object)) {
        let objectPrev;
        useReaction(() => {
            const objectNext = resolveClass(object);
            setClassesStatic(props, key, objectNext, objectPrev);
            objectPrev = objectNext;
        });
    }
    else {
        setClassesStatic(props, key, object);
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
// const setDirective = (() => {
//     const runWithSuperRoot = _with()
//     return <T extends unknown[]>(props: any, directive: string, args: T): void => {
//         const symbol = SYMBOLS_DIRECTIVES[directive] || Symbol()
//         const data = DIRECTIVE_OUTSIDE_SUPER_ROOT.current ? context<DirectiveData<T>>(symbol) : runWithSuperRoot(() => context<DirectiveData<T>>(symbol))
//         if (!data) throw new Error(`Directive "${directive}" not found`)
//         //@ts-ignore
//         const call = () => data.fn(props, ...castArray(args) as any) //TSC
//         //@ts-ignore
//         if (data.immediate) {
//             call()
//         } else {
//             useMicrotask(call)
//         }
//     }
// })()
// const setEventStatic = (() => {
//     //TODO: Maybe delegate more events: [onmousemove, onmouseout, onmouseover, onpointerdown, onpointermove, onpointerout, onpointerover, onpointerup, ontouchend, ontouchmove, ontouchstart]
//     const delegatedEvents = <const>{
//         onauxclick: ['_onauxclick', false],
//         onbeforeinput: ['_onbeforeinput', false],
//         onclick: ['_onclick', false],
//         ondblclick: ['_ondblclick', false],
//         onfocusin: ['_onfocusin', false],
//         onfocusout: ['_onfocusout', false],
//         oninput: ['_oninput', false],
//         onkeydown: ['_onkeydown', false],
//         onkeyup: ['_onkeyup', false],
//         onmousedown: ['_onmousedown', false],
//         onmouseup: ['_onmouseup', false]
//     }
//     const delegate = (event: string): void => {
//         const key = `_${event}`
//         via.document.addEventListener(event.slice(2), async event => {
//             const targets = event.composedPath()
//             const target = targets[0] || document
//             Object.defineProperty(event, 'currentTarget', {
//                 configurable: true,
//                 get() {
//                     return target
//                 }
//             })
//             for (let i = 0, l = targets.length; i < l; i++) {
//                 const handler = targets[i][key]
//                 if (!handler) continue
//                 handler(event)
//                 if (event.cancelBubble) break
//             }
//         })
//     }
//     return (props: any, event: string, value: null | undefined | EventListener): void => {
//         const delegated = delegatedEvents[event]
//         if (delegated) {
//             if (!delegated[1]) { // Not actually delegating yet
//                 delegated[1] = true
//                 delegate(event)
//             }
//             props[delegated[0]] = value
//         } else if (event.endsWith('passive')) {
//             const isCapture = event.endsWith('capturepassive')
//             const type = event.slice(2, -7 - (isCapture ? 7 : 0))
//             const key = `_${event}`
//             const valuePrev = props[key]
//             if (valuePrev) props.removeEventListener(type, valuePrev, { capture: isCapture })
//             if (value) props.addEventListener(type, value, { passive: true, capture: isCapture })
//             props[key] = value
//         } else if (event.endsWith('capture')) {
//             const type = event.slice(2, -7)
//             const key = `_${event}`
//             const valuePrev = props[key]
//             if (valuePrev) props.removeEventListener(type, valuePrev, { capture: true })
//             if (value) props.addEventListener(type, value, { capture: true })
//             props[key] = value
//         } else {
//             props[event] = value
//         }
//     }
// })()
// const setEvent = (props: any, event: string, value: ObservableMaybe<null | undefined | EventListener>): void => {
//     if (isObservable(value))
//         new CallableEventStatic(value, props, event)
//     else
//         setEventStatic(props, event, value)
// }
const setHTMLStatic = (props, value) => {
    props.children = String(isNil(value) ? '' : value);
};
const setHTML = (props, value) => {
    useReaction(() => setHTMLStatic(props, $$($$(value).__html)));
};
/**
 *
 * @param props
 * @param key
 * @param value
 */
const setPropertyStatic = (props, key, value) => {
    if (key === 'tabIndex' && isBoolean(value))
        value = (value ? 0 : undefined);
    props[key] = value;
    // if (isNil(value))
    //     setAttributeStatic(props, key, null)
};
const setProperty = (props, key, value) => {
    if (isFunction(value))
        if (isObservable(value))
            new CallablePropertyStatic(value, props, key);
        else
            useReaction(() => setPropertyStatic(props, key, value()));
    else
        setPropertyStatic(props, key, value);
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
    return (props, key, value) => {
        var _a;
        if (!props.style)
            props.style = {};
        if (key.charCodeAt(0) === 45) { // /^-/
            if (isNil(value))
                delete props.style[key];
            else
                props.style[key] = String(value);
        }
        else if (isNil(value))
            props.style[key] = null;
        else
            props.style[key] = ((isString(value) || (propertyNonDimensionalCache[_a = key] || (propertyNonDimensionalCache[_a] = propertyNonDimensionalRe.test(key))) ? value : `${value}px`));
    };
})();
const setStyle = (props, key, value) => {
    if (isFunction(value))
        if (isObservable(value))
            new CallableStyleStatic(value, props, key);
        else
            useReaction(() => {
                const v = value();
                setStyleStatic(props, key, value());
            });
    else
        setStyleStatic(props, key, value);
};
const setStylesStatic = (props, object, objectPrev) => {
    if (isString(object))
        props.style = object;
    else {
        if (objectPrev) {
            if (isString(objectPrev)) {
                if (objectPrev)
                    props.style.cssText = '';
            }
            else {
                objectPrev = store(objectPrev, { unwrap: true });
                for (const key in objectPrev) {
                    if (object && key in object)
                        continue;
                    setStyleStatic(props, key, null);
                }
            }
        }
        if (isStore(object))
            for (const key in object) {
                const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key)); //TSC
                setStyle(props, key, fn);
            }
        else
            for (const key in object)
                setStyle(props, key, object[key]);
    }
};
const setStyles = (props, object) => {
    if (isFunction(object)) {
        if (isObservable(object))
            new CallableStylesStatic(object, props);
        else {
            let objectPrev;
            useReaction(() => {
                const objectNext = object();
                setStylesStatic(props, objectNext, objectPrev);
                objectPrev = objectNext;
            });
        }
    }
    else
        setStylesStatic(props, object);
};
// const setTemplateAccessor = <T, K extends keyof T, V extends T[K]> (props: T, key: K, value: TemplateActionProxy): void => {
//     if (key === 'children') {
//         const placeholder = createText('') // Using a Text node rather than a Comment as the former may be what we actually want ultimately
//         props.insertBefore(placeholder, null)
//         value(props, 'setChildReplacement', undefined, placeholder)
//     } else if (key === 'ref') {
//         value(props, 'setRef')
//     } else if (key === 'style') {
//         value(props, 'setStyles')
//     } else if (key === 'class') {
//         if (!isSVG(props)) {
//             props.className = '' // Ensuring the attribute is present
//         }
//         value(props, 'setClasses')
//     } else if (key === 'dangerouslySetInnerHTML') {
//         value(props, 'setHTML')
//     } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) { // /^on/
//         value(props, 'setEvent', key.toLowerCase())
//     } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) { // /^u..:/
//         value(props, 'setDirective', key.slice(4))
//     } else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' || key === 'className') {
//         // Forbidden props
//     } else if (key in props && !isSVG(props)) {
//         value(props, 'setProperty', key)
//     } else {
//         props.setAttribute(key, '') // Ensuring the attribute is present
//         value(props, 'setAttribute', key)
//     }
// }
const setProp = (props, key, value) => {
    // if (isTemplateAccessor(value))
    //     setTemplateAccessor(props, key, value)
    //else
    if (key === 'children')
        setChild(props, value);
    else if (key === 'ref')
        setRef(props, value);
    else if (key === 'style')
        setStyles(props, value);
    else if (key === 'class' || key === 'className')
        setClasses(props, key, value);
    else if (key === 'dangerouslySetInnerHTML')
        setHTML(props, value);
    else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) // /^on/
     {
        //strip event
        // setEvent(props, key.toLowerCase(), value)
        // $.root(() => props.addEventListener(key.substring(2).toLowerCase(), value as any))
    }
    else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) // /^u..:/
     {
        // setDirective(props, key.slice(4), value as any)
    }
    else if (key === 'innerHTML' || key === 'outerHTML' || key === 'textContent' /* || key === 'className' */) {
        // Forbidden props
    }
    else //if (key in props)
        setProperty(props, key, value);
    // else
    //     setAttribute(props, key, value as any)
};
const setProps = (props, object) => {
    for (const key in object)
        setProp(props, key, object[key]);
};
/* EXPORT */
export { /* setAttributeStatic, setAttribute, setChildReplacementFunction, */ /* setChildReplacementText, setChildReplacement, */ setChildStatic, setChild, setClassStatic, setClass, setClassBooleanStatic, setClassesStatic, setClasses, /* setEventStatic, setEvent,  */ setHTMLStatic, setHTML, setPropertyStatic, setProperty, setRef, setStyleStatic, setStyle, setStylesStatic, setStyles, /* setTemplateAccessor, */ setProp, setProps };
