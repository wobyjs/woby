import { SYMBOL_JSX } from '../constants'

export const isJsxProp = <T>(props: T): props is T & { [SYMBOL_JSX]: true } => props && props[SYMBOL_JSX]