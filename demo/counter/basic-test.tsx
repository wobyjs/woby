import { renderToString } from 'woby/ssr'

const result = renderToString(<div class="test"><h1>Hello World</h1></div>)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')