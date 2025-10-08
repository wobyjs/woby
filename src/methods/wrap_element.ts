import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import { DEBUGGER, Stack } from 'soby'
export const SYMBOL_STACK = Symbol('STACK')

export interface StackTaggedFunction extends Function {
  [SYMBOL_STACK]?: Stack
}


export const wrapElement = <T extends Function>(element: T): T & StackTaggedFunction => {

  element[SYMBOL_UNTRACKED_UNWRAPPED] = true
  if (DEBUGGER.test)
    element[SYMBOL_STACK] = new Stack("createElement")

  return element

}