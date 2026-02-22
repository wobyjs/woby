
/* IMPORT */

import useMemo from '../hooks/use_memo'
import createElement from '../methods/create_element.ssr'
import resolve from '../methods/resolve'
import $$ from '../methods/SS'
import { isFunction, isString } from '../utils/lang'
import type { Child, Component, FunctionMaybe } from '../types'

/* MAIN */

const Dynamic = <P = {}>({ component, props/* , children */ }: { component: Component<P>, props?: FunctionMaybe<P | null>/* , children?: Child */ }): Child => {

    if (isFunction(component) || isFunction(props)) {

        return useMemo(() => {
            const resolvedComponent = $$(component as FunctionMaybe<Child>);
            // If the resolved component is a string (tag name), create an element with it
            if (isString(resolvedComponent)) {
                return resolve(createElement(resolvedComponent as Component<P>, $$(props), /* children */));
            } else {
                return resolve(createElement<P>(resolvedComponent as Component<P>, $$(props), /* children */));
            }
        })

    } else {
        // If component is a string tag name, create element directly
        if (isString(component)) {
            return createElement(component, props, /* children */);
        } else {
            return createElement<P>(component, props, /* children */)
        }
    }
}

/* EXPORT */

export default Dynamic
