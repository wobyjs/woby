
/* IMPORT */

import { $, h, render } from 'woby' //h syntax only but link to woby not woby/ssr
import type { JSX } from 'woby'

/* MAIN */

const Counter = (): JSX.Element => {

    const value = $(0)

    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return [
        h('h1', null, 'Counter'),
        h('p', null, value),
        h('button', { onClick: increment } as any, '+'),
        h('button', { onClick: decrement } as any, '-')
    ]

}

render(Counter, document.getElementById('app'))
