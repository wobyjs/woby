
/* IMPORT */

import type { Child } from '../types'
import { setChild } from '../utils/setters.ssr'


export const renderToString = (child: Child): string => {

    const p = { children: null }
    setChild(p as any, child)

    return p.children.flat(Infinity).join('')
}

export default renderToString
