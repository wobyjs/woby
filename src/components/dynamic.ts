import { useMemo } from '../hooks/soby'
import { createElement } from '../methods/create_element'
import { resolve } from '../methods/soby'
import { $$ } from '../methods/soby'
import { isFunction } from '../utils/lang'
import type { Child, Component, FunctionMaybe } from '../types'
import { useEnvironment } from '../components/environment_context'


export const Dynamic = <P = {}>(props: { component: Component<P> } & P): Child => {
    // const isSSR = useEnvironment() === 'ssr'
    const { component, ...rest } = props

    if (isFunction(component) || isFunction(props) /* && !isSSR */) {

        return useMemo(() => {

            return resolve(createElement<P>($$(component, false), $$(rest as any))/* , children */)

        })

    } else {

        return createElement<P>(component, $$(rest as any))/* , children */

    }

}