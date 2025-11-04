/* IMPORT */

import type { ComponentIntrinsicElement, FN } from '../types'
import { createComment as cc, createHTMLNode as ch, createSVGNode as cs, createText as ct, createDocumentFragment as cd } from './creators.ssr'

declare const via

/* MAIN */

// Simple approach: always use SSR versions in Node.js environment
const isNodeEnvironment = typeof window === 'undefined' && typeof document === 'undefined'

const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment } = isNodeEnvironment
    // ? { createComment: cc as typeof document['createComment'], createHTMLNode: ch as typeof document['createElement'], createSVGNode: cs as any as typeof document['createElementNS'], createText: ct as any as typeof document['createTextNode'], createDocumentFragment: cd as typeof document['createDocumentFragment'] }
    ? { createComment: cc, createHTMLNode: ch, createSVGNode: cs, createText: ct, createDocumentFragment: cd }
    : (() => {
        // Browser environment
        if (typeof via !== 'undefined') {
            const document = via.document
            return {
                createComment: document.createComment as any as FN<[any], Comment>,
                createHTMLNode: document.createElement as any as FN<[ComponentIntrinsicElement], HTMLElement>,
                createSVGNode: ((name: string) => document.createElementNS('http://www.w3.org/2000/svg', name)) as any as FN<[ComponentIntrinsicElement], SVGElement>,
                createText: document.createTextNode as any as FN<[any], Text>,
                createDocumentFragment: document.createDocumentFragment as any as FN<[], DocumentFragment>
            }
        } else {
            // Standard browser environment
            return {
                createComment: document.createComment.bind(document, '') as FN<[any], Comment>,
                createHTMLNode: document.createElement.bind(document) as FN<[ComponentIntrinsicElement], HTMLElement>,
                createSVGNode: document.createElementNS.bind(document, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], Element>,
                createText: document.createTextNode.bind(document) as FN<[any], Text>,
                createDocumentFragment: document.createDocumentFragment.bind(document) as FN<[], DocumentFragment>
            }
        }
    })()

/* EXPORT */

export { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment }