//todo, now comment to reduce build time & size
// import { Window } from 'happy-dom'
import type { FN } from '../types'

// Create a happy-dom window instance for SSR
const window = new Window()
const document = window.document

export const createComment = ((content: string) => document.createComment(content)) as any as FN<[string], Comment>
export const createHTMLNode = ((tagName: string) => document.createElement(tagName)) as any as FN<[string], HTMLElement>
export const createSVGNode = ((tagName: string) => document.createElementNS('http://www.w3.org/2000/svg', tagName)) as any as FN<[string], SVGElement>
export const createText = ((text: string) => document.createTextNode(text)) as any as FN<[string], Text>
export const createDocumentFragment = document.createDocumentFragment.bind(document) as any as FN<[], DocumentFragment>

// export const createComment = document.createComment.bind(document, '') as FN<[any], Comment>
// export const createHTMLNode = document.createElement.bind(document) as FN<[ComponentIntrinsicElement], HTMLElement>
// export const createSVGNode = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], Element>
// export const createText = document.createTextNode.bind(document) as FN<[any], Text>
// export const createDocumentFragment = document.createDocumentFragment.bind(document) as FN<[], DocumentFragment>