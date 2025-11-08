import { isSSR } from '../constants'
import { useMemo } from '../hooks/soby'
import { createElement as createElementSSR } from '../methods/create_element.ssr'
import { createElement as createElementClient } from '../methods/create_element'
import { resolve } from '../methods/soby'
import { $$ } from '../methods/soby'
import { isFunction } from '../utils/lang'
import type { Child, Component, FunctionMaybe } from '../types'


export const Dynamic = <P = {}>({ component, props, children }: { component: Component<P>, props?: FunctionMaybe<P | null>, children?: Child }): Child => {

    // In SSR mode, we don't pass children to avoid duplication issues
    const resolvedChildren = isSSR ? undefined : children;
    const createElement = isSSR ? createElementSSR : createElementClient;

    if (isFunction(component) || isFunction(props)) {

        return useMemo(() => {

            return resolve(createElement<P>($$(component, false), $$(props), resolvedChildren))

        })

    } else {

        return createElement<P>(component, props, resolvedChildren)

    }
}