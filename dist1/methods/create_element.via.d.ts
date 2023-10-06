import type { Child, Component, Element } from '../types'
export declare const IsSvgSymbol: unique symbol
declare const createElement: <P = {}>(component: string | (new (props: {}) => Child) | import("../types").ComponentFunction<P>, props?: P, ..._children: Child[]) => Element
export default createElement
