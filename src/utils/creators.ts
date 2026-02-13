import type { ComponentIntrinsicElement, FN } from '../types'

import { document as doc } from '../ssr/document'
import { customElements } from '../ssr/custom_elements'
import { MutationObserver } from '../ssr/mutation_observer'
import type { MutationCallback } from '../ssr/mutation_callback'

declare const via

export type Env = 'ssr' | 'browser' | 'via'

export function getEnv(type?: Env) {
    // Auto-detect environment if not provided
    const detectedType = type ?? (typeof window === 'undefined' ? 'ssr' : 'browser');
    const isSSR = detectedType === 'ssr'
    // Return all necessary exports for SSR environment
    if (isSSR) {
        return {
            document: doc,
            customElements,
            MutationObserver,
            isSSR: isSSR,
            ...getCreators(detectedType)
        }
    } else {
        return {
            document: globalThis.document,
            customElements: globalThis.customElements,
            MutationObserver: globalThis.MutationObserver,
            isSSR: false,
            ...getCreators(detectedType)
        }
    }
}

function getCreators(type = 'browser' as 'ssr' | 'browser' | 'via') {
    // Browser environment
    if (typeof via !== 'undefined' && type === 'via') {
        const document = via.document
        return {
            createComment: document.createComment as any as FN<[any], Comment>,
            createHTMLNode: document.createElement as any as FN<[ComponentIntrinsicElement], HTMLElement>,
            createSVGNode: ((name: string) => document.createElementNS('http://www.w3.org/2000/svg', name)) as any as FN<[ComponentIntrinsicElement], SVGElement>,
            createText: document.createTextNode as any as FN<[any], Text>,
            createDocumentFragment: document.createDocumentFragment as any as FN<[], DocumentFragment>
        }
    } else {
        const document = type === 'ssr' ? doc : globalThis.document
        // Ensure document exists before trying to bind methods
        if (!document) {
            // Fallback to SSR document for browser type when document is not available
            const fallbackDoc = doc;
            return {
                createComment: fallbackDoc.createComment.bind(fallbackDoc) as FN<[any], Comment>,
                createHTMLNode: fallbackDoc.createElement.bind(fallbackDoc) as FN<[ComponentIntrinsicElement], HTMLElement>,
                createSVGNode: fallbackDoc.createElementNS.bind(fallbackDoc, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], SVGElement>,
                createText: fallbackDoc.createTextNode.bind(fallbackDoc) as FN<[any], Text>,
                createDocumentFragment: fallbackDoc.createDocumentFragment.bind(fallbackDoc) as FN<[], DocumentFragment>
            };
        }
        return {
            createComment: document.createComment.bind(document) as FN<[any], Comment>,
            createHTMLNode: document.createElement.bind(document) as FN<[ComponentIntrinsicElement], HTMLElement>,
            createSVGNode: document.createElementNS.bind(document, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], SVGElement>,
            createText: document.createTextNode.bind(document) as FN<[any], Text>,
            createDocumentFragment: document.createDocumentFragment.bind(document) as FN<[], DocumentFragment>
        }
    }
}
