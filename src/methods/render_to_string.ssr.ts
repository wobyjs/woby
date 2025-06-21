
/* IMPORT */

import { FragmentUtils } from '../utils/fragment'
import type { Child } from '../types'
import { setChild } from '../utils/setters.ssr'


export const renderToString = (child: Child): string => {

    const p = { children: null }
    const stack = new Error()
    setChild(p as any, child, FragmentUtils.make(), stack)

    return p.children.flat(Infinity).join('')
}

export default renderToString
