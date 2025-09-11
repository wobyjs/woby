/* IMPORT */

import type { FragmentNode, FragmentFragment, Fragment } from '../types'

/* HELPERS */

const NOOP_CHILDREN: any[] = []

/* MAIN */

export const FragmentUtils = {

    make: (): Fragment => {

        return {
            values: undefined,
            length: 0
        }

    },

    makeWithNode: (node: any): FragmentNode => {

        return {
            values: node,
            length: 1
        }

    },

    makeWithFragment: (fragment: Fragment): FragmentFragment => {

        return {
            values: fragment,
            fragmented: true,
            length: 1
        }

    },

    getChildrenFragmented: (thiz: Fragment, children: any[] = []): any[] => {

        const { values, length } = thiz

        if (!length) return children

        if (values instanceof Array) {

            for (let i = 0, l = values.length; i < l; i++) {

                const value = values[i]

                if (typeof value === 'object' && value !== null && ('nodeType' in value || value instanceof Object)) {

                    children.push(value)

                } else {

                    FragmentUtils.getChildrenFragmented(value as unknown as Fragment, children)

                }

            }

        } else {

            if (typeof values === 'object' && values !== null && ('nodeType' in values || values instanceof Object)) {

                children.push(values)

            } else {

                FragmentUtils.getChildrenFragmented(values as unknown as Fragment, children)

            }

        }

        return children

    },

    getChildren: (thiz: Fragment): any | any[] => {

        if (!thiz.length) return NOOP_CHILDREN

        if (!thiz.fragmented) return thiz.values as any

        if (thiz.length === 1) return FragmentUtils.getChildren(thiz.values)

        return FragmentUtils.getChildrenFragmented(thiz)

    },

    pushFragment: (thiz: Fragment, fragment: Fragment): void => {

        FragmentUtils.pushValue(thiz, fragment)

        thiz.fragmented = true

    },

    pushNode: (thiz: Fragment, node: any): void => {

        FragmentUtils.pushValue(thiz, node)

    },

    pushValue: (thiz: Fragment, value: any): void => {

        const { values, length } = thiz as any //TSC

        if (length === 0) {

            thiz.values = value

        } else if (length === 1) {

            thiz.values = [values, value]

        } else {

            values.push(value)

        }

        thiz.length += 1

    },

    replaceWithNode: (thiz: Fragment, node: any): void => {

        thiz.values = node
        delete thiz.fragmented
        thiz.length = 1

    },

    replaceWithFragment: (thiz: Fragment, fragment: Fragment): void => {

        thiz.values = fragment.values
        thiz.fragmented = fragment.fragmented
        thiz.length = fragment.length

    }

}