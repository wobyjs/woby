import type { FN } from '../types'
import { document } from '../ssr/document'

// Re-export creator functions from the document object
export const createComment = document.createComment
export const createHTMLNode = document.createElement
export const createSVGNode = ((tagName: string) => {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName)
}) as any as FN<[string], SVGElement>
export const createText = document.createTextNode
export const createDocumentFragment = document.createDocumentFragment