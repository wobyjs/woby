
/* IMPORT */

import { SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_OBSERVABLE_WRITABLE, SYMBOL_UNCACHED, SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import isObservable from '../methods/is_observable'
import useRenderEffect from '../hooks/use_render_effect'
import $$ from '../methods/SS'
import { isArray, isFunction, isString, isProxy, fixBigInt, toArray } from '../utils/lang'
import type { Classes, ObservableMaybe, Styles } from '../types'
import { createText, createComment, createHTMLNode } from '../utils/creators'
import { IgnoreSymbols } from 'via.js'
import { Stack } from '../soby'

const HTMLValue = Symbol('HtmlValue')
IgnoreSymbols[HTMLValue] = HTMLValue


/* MAIN */
const resolveChild = <T>(value: ObservableMaybe<T>, setter?: ((value: T | T[], dynamic: boolean, stack: Stack) => void), _dynamic?: boolean, stack?: Error): T | T[] => {
    const updateElement = (/** null placeholder */e: Text, f: boolean, v: any, pv: HTMLElement[] /** in proxy */) => {
        e.textContent = ''

        if (Array.isArray(v)) {
            e[HTMLValue] = 'array'
            if (!f)
                e.parentElement.replaceChildren(e, ...toArray(v) as any)

            return [e, ...v]
        }
        else {
            const useE = () => {
                if (pv) {
                    switch (pv[0][HTMLValue]) {
                        case 'element':
                            pv[0].replaceWith(e) // push back primitive place holder
                            break
                        case 'primitive': // do nothing
                        case 'array':
                            {
                                pv.slice(1).forEach(p => p.remove()) // remove all previous elements
                                break
                            }
                        case 'symbol':
                        case 'null':
                            // e.parentElement.replaceChildren(v as any) //no more placeholder
                            break
                    }
                }
            }

            if (typeof v === 'symbol') {
                e[HTMLValue] = 'symbol'
                if (!f)
                    e.parentElement.replaceChildren(e)
                return [e] // return null with place holder
            }
            else {
                //object
                if (isProxy(v)) {
                    e[HTMLValue] = 'element'
                    v[HTMLValue] = 'element'

                    if (pv) {
                        switch (pv[0][HTMLValue]) {
                            case 'element':
                                pv[0].replaceWith(v as any) // 1 to 1 replacement
                                break
                            case 'primitive': // get parent to replace this
                            case 'array':
                            case 'symbol':
                            case 'null':
                                pv[0].parentElement.replaceChildren(...toArray(v) as any) //no more placeholder
                                break
                        }
                    }
                    return [v]
                }
                //primitive
                else if (!(v === undefined || v === null)) {
                    e[HTMLValue] = 'primitive'
                    e.textContent = fixBigInt(v)

                    useE()

                    return [e/* , fixBigInt(v) */]  // primitive placeholder
                }
                else {
                    e[HTMLValue] = 'null'
                    useE()
                    return [e]  // null/undefined placeholder
                }
            }
        }
    }

    if (isProxy(value)) {
        return value as T
    }
    //Observable
    else if (isFunction(value)) {

        if (SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || value[SYMBOL_OBSERVABLE_READABLE]?.parent?.disposed) {

            (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

            resolveChild(value(), setter, _dynamic, stack)

        } else {
            const e = createText('') //('div') as any as HTMLDivElement
            let f = true  //first time no parent
            let v: any[]
            useRenderEffect((stack) => {
                const pv = v;

                (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack

                v = resolveChild(value(), null, false, stack) as any
                v = updateElement(e, f, v, pv)
                f = false
            }, stack)
            return v as any // [e, ...[v].flat(Infinity)] as any
        }
    } else if (isArray(value)) {
        const [values, hasObservables] = resolveArraysAndStatics(value)

        values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED] // Preserving this special symbol

        if (hasObservables) {
            const e = createText('')
            let f = true  //first time no parent
            let v: any[]
            useRenderEffect(() => {
                const pv = v
                v = values.map(v => resolveChild(v, null, false, stack)).filter(v => typeof v !== 'undefined') //, true)
                v = updateElement(e, f, v, pv)
                f = false
            }, stack)
            return v //[...v] as any
        } else {
            const vs: any[] = values.map(v => resolveChild(v, null, false, stack)).filter(v => typeof v !== 'undefined')
            return vs
        }
    }
    else {
        return value
    }
}

const resolveClass = (classes: Classes, resolved: Record<string, true> = {}): Record<string, true> => {

    if (isString(classes)) {

        classes.split(/\s+/g).filter(Boolean).filter(cls => {

            resolved[cls] = true

        })

    } else if (isFunction(classes)) {

        resolveClass(classes(), resolved)

    } else if (isArray(classes)) {

        classes.forEach(cls => {

            resolveClass(cls as Classes, resolved) //TSC

        })

    } else if (classes) {

        for (const key in classes) {

            const value = classes[key]
            const isActive = !!$$(value)

            if (!isActive) continue

            resolved[key] = true

        }

    }

    return resolved

}

const resolveStyle = (styles: Styles, resolved: Record<string, null | undefined | number | string> | string = {}): Record<string, null | undefined | number | string> | string => {

    if (isString(styles)) { //TODO: split into the individual styles, to be able to merge them with other styles

        return styles

    } else if (isFunction(styles)) {

        return resolveStyle(styles(), resolved)

    } else if (isArray(styles)) {

        styles.forEach(style => {

            resolveStyle(style as Styles, resolved) //TSC

        })

    } else if (styles) {

        for (const key in styles) {

            const value = styles[key]

            resolved[key] = $$(value)

        }

    }

    return resolved

}

const resolveArraysAndStatics = (() => {

    // This function does 3 things:
    // 1. It deeply flattens the array, only if actually needed though (!)
    // 2. It resolves statics, it's important to resolve them soon enough or they will be re-created multiple times (!)
    // 3. It checks if we found any Observables along the way, avoiding looping over the array another time in the future

    const DUMMY_RESOLVED = []
    const resolveArraysAndStaticsInner = (values: any[], resolved: any[], hasObservables: boolean): [any[], boolean] => {

        for (let i = 0, l = values.length; i < l; i++) {

            const value = values[i]
            const type = typeof value

            if (type === 'string' || type === 'number' || type === 'bigint') { // Static

                if (resolved === DUMMY_RESOLVED) resolved = values.slice(0, i)

                resolved.push(createText(fixBigInt(value)))

            } else if (type === 'object' && isArray(value)) { // Array

                if (resolved === DUMMY_RESOLVED) resolved = values.slice(0, i)

                hasObservables = resolveArraysAndStaticsInner(value, resolved, hasObservables)[1]

            } else if (type === 'function' && isObservable(value)) { // Observable

                if (resolved !== DUMMY_RESOLVED) resolved.push(value)

                hasObservables = true

            } else { // Something else

                if (resolved !== DUMMY_RESOLVED) resolved.push(value)

            }

        }

        if (resolved === DUMMY_RESOLVED) resolved = values

        return [resolved, hasObservables]

    }

    return (values: any[]): [any[], boolean] => {

        return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false)

    }

})()

/* EXPORT */

export { resolveChild, resolveClass, resolveArraysAndStatics, resolveStyle }
