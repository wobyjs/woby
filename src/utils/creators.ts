import type { ComponentIntrinsicElement, FN } from '../types'

import { document as doc } from '../ssr/document'
import { customElements } from '../ssr/custom_elements'
import { MutationObserver } from '../ssr/mutation_observer'
import type { MutationObserverInit } from '../ssr/mutation_observer_init'
import type { MutationRecord } from '../ssr/mutation_record'
import type { MutationCallback } from '../ssr/mutation_callback'

declare const via

export function getEnv(type = 'browser' as 'ssr' | 'browser' | 'via') {
    const isSSR = type === 'ssr'
    // Return all necessary exports for SSR environment
    if (isSSR) {
        return {
            document: doc,
            customElements,
            MutationObserver,
            isSSR: isSSR,
            ...getCreators(type)
        }
    } else {
        return {
            document: globalThis.document,
            customElements: globalThis.customElements,
            MutationObserver: globalThis.MutationObserver,
            isSSR: false,
            ...getCreators(type)
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
        // Fallback to SSR versions if document is not available or binding fails
        return {
            createComment: document.createComment.bind(document, '') as FN<[any], Comment>,
            createHTMLNode: document.createElement.bind(document) as FN<[ComponentIntrinsicElement], HTMLElement>,
            createSVGNode: document.createElementNS.bind(document, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], Element>,
            createText: document.createTextNode.bind(document) as FN<[any], Text>,
            createDocumentFragment: document.createDocumentFragment.bind(document) as FN<[], DocumentFragment>
        }
    }
}
