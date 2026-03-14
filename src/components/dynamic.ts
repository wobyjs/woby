import { useMemo } from '../hooks/soby'
import { createElement } from '../methods/create_element'
import { isObservable, resolve } from '../methods/soby'
import { $$ } from '../methods/soby'
import { isFunction } from '../utils/lang'
import type { Child, Component, FunctionMaybe, ObservableMaybe } from '../types'
import { EnvironmentContext, useEnvironment } from '../components/environment_context'


export const Dynamic = <P = {}>({ component, props: propsProp, ...restProps }: { component: ObservableMaybe<Component<P>>, props?: FunctionMaybe<P> } & Omit<P, 'props'>): Child => {
    const env = useEnvironment()
    const isSSR = env === 'ssr'

    if (isSSR) {
        const finalProps = propsProp !== undefined
            ? { ...restProps, ...$$(propsProp as any) }
            : restProps

        const comp = isObservable(component) ? $$(component) : component
        const element = createElement<P>(comp as Component<P>, finalProps as P)
        const resolved = resolve(element)
        return resolved as any
    }
    else
        if (isFunction(component) || isFunction(propsProp)) {
            return useMemo(() => {
                // Merge restProps with resolved propsProp
                const finalProps = propsProp !== undefined
                    ? { ...restProps, ...$$(propsProp as any) }
                    : restProps

                const comp = isObservable(component) ? $$(component) : component

                return EnvironmentContext.Provider(env, () => resolve(createElement<P>(comp as Component<P>, finalProps as P)))
            }) as any

        } else {
            // For string components (like "h5", "div", etc.), we need to make it reactive
            return useMemo(() => {
                // Merge restProps with resolved propsProp
                const finalProps = propsProp !== undefined
                    ? { ...restProps, ...$$(propsProp as any) }
                    : restProps

                return EnvironmentContext.Provider(env, () => createElement<P>(component, finalProps as P))
            }) as any

        }

}