
/* IMPORT */

import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import { DEBUGGER, Stack } from 'soby'
export const SYMBOL_STACK = Symbol('STACK')

/* MAIN */
export interface StackTaggedFunction extends Function {
  [SYMBOL_STACK]?: Stack
}


const wrapElement = <T extends Function>(element: T): T & StackTaggedFunction => {

  element[SYMBOL_UNTRACKED_UNWRAPPED] = true
  if (DEBUGGER.test)
    element[SYMBOL_STACK] = new Stack("createElement")

  return element

}

/* EXPORT */

export default wrapElement