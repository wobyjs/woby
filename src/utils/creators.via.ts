
import 'via.js/controller'
import type { ViaClass } from 'via.js/controller'
import type { ComponentIntrinsicElement, FN } from '../types'

const via = (globalThis as any).via as ViaClass
const document = (via as any).document

export const createComment = document.createComment as any as FN<[any], Comment>
export const createHTMLNode = document.createElement as any as FN<[ComponentIntrinsicElement], HTMLElement>
export const createSVGNode = (name: string) => document.createElementNS('http://www.w3.org/2000/svg', name) as any as FN<[ComponentIntrinsicElement], SVGElement>
export const createText = document.createTextNode as any as FN<[any], Text>
export const createDocumentFragment = document.createDocumentFragment as any as FN<[], DocumentFragment>


