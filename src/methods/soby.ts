import { isFunction } from '../utils'
import { isObservable } from '../soby'

export { batch } from '../soby'
export { isBatching } from '../soby'
export { isObservableWritable } from '../soby'
export { isObservable } from '../soby'
export { isStore } from '../soby'
export { resolve } from '../soby'
export { observable as $ } from '../soby'
export { get as $$ } from '../soby'
export { store } from '../soby'
export { tick } from '../soby'
export { untrack } from '../soby'
export { context } from '../soby'
// import {SYMBOL_SSR} from '../constants'

// export function $$(value, getFunction = true) {
//     const is = getFunction ? isFunction : isObservable
//     if (is(value)) {
//         return value(value[SYMBOL_SSR])
//     }
//     else {
//         return value
//     }
// }