

import { useMemo } from '../hooks/soby'
import { createElement } from '../methods/create_element'
import { resolve } from '../methods/soby'
import { $$ } from '../methods/soby'
import { isFunction } from '../utils/lang'
import type { Child, Component, FunctionMaybe } from '../types'


export const Dynamic = <P = {}>({ component, props, children }: { component: Component<P>, props?: FunctionMaybe<P | null>, children?: Child }): Child => {

    if (isFunction(component) || isFunction(props)) {

        return useMemo(() => {

            return resolve(createElement<P>($$(component, false), $$(props), children))

        })

    } else {

        return createElement<P>(component, props, children)

    }

}