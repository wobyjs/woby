/* IMPORT */

import { $ } from 'woby'
import { html } from '../../src/methods/html.ssr.ts'
import { renderToString } from '../../src/methods/render_to_string.ssr.ts'
import type { JSX } from 'woby'

/* MAIN */

const Counter = (): JSX.Element => {

    const value = $(0)

    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return html`
    <div>
      <h1>Counter</h1>
      <p>${value}</p>
      <button>+</button>
      <button>-</button>
    </div>
  `

}

// Render to string instead of DOM
const htmlString = renderToString(Counter())
console.log(htmlString)