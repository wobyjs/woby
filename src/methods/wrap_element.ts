import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import { DEBUGGER, Stack } from 'soby'
export const SYMBOL_STACK = Symbol('STACK')

export interface StackTaggedFunction extends Function {
  [SYMBOL_STACK]?: Stack
}


export const wrapElement = <T extends Function>(element: T): T & StackTaggedFunction => {

  element[SYMBOL_UNTRACKED_UNWRAPPED] = true
  // Stack capture (Error subclass) is expensive; only tag when actively debugging.
  // SYMBOL_STACK has no readers in woby or chk (chk's consumers are commented out),
  // so gate on DEBUGGER.debug (matches callStack convention) instead of DEBUGGER.test.
  if (DEBUGGER.debug)
    element[SYMBOL_STACK] = new Stack("createElement")

  return element

}