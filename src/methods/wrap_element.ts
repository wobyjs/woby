import { Child } from '../types'
import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import { DEBUGGER, Stack } from 'soby'
export const SYMBOL_STACK = Symbol('STACK')
import { Env } from '../utils/creators'

export interface StackTaggedFunction extends Function {
  [SYMBOL_STACK]?: Stack
}


export const wrapElement = <T extends (env: Env) => Child>(element: T): T & StackTaggedFunction => {

  element[SYMBOL_UNTRACKED_UNWRAPPED] = true
  if (DEBUGGER.test)
    element[SYMBOL_STACK] = new Stack("createElement")

  return element

}