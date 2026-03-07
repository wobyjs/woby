import type { ComponentIntrinsicElement, FN } from '../types'
import { createComment as createCommentSSR, createText as createTextSSR, createDocumentFragment as createDocumentFragmentSSR, createElement as createHTMLNodeSSR } from '../ssr/document'
import { createSVGNode as createSVGNodeSSR } from '../ssr/document'

// Enhanced mock implementations for SSR without happy-dom
// These implementations better support the html`` template pattern from index.tsx

declare const via

/* MAIN */

// Simple approach: always use SSR versions in Node.js environment
const isNodeEnvironment = typeof window === 'undefined' && typeof document === 'undefined'

function getCreators() {
    if (isNodeEnvironment) {
        return {
            createComment: createCommentSSR,
            createHTMLNode: createHTMLNodeSSR,
            createSVGNode: createSVGNodeSSR,
            createText: createTextSSR,
            createDocumentFragment: createDocumentFragmentSSR
        }
    } else {
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
            try {
                // Check if document exists before trying to bind
                if (typeof document !== 'undefined' && document !== null) {
                    return {
                        createComment: document.createComment.bind(document, '') as FN<[any], Comment>,
                        createHTMLNode: document.createElement.bind(document) as FN<[ComponentIntrinsicElement], HTMLElement>,
                        createSVGNode: document.createElementNS.bind(document, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], Element>,
                        createText: document.createTextNode.bind(document) as FN<[any], Text>,
                        createDocumentFragment: document.createDocumentFragment.bind(document) as FN<[], DocumentFragment>
                    }
                }
            } catch (e) {
                // Ignore error and fall through to SSR versions
            }

            // Fallback to SSR versions if document is not available or binding fails
            return {
                createComment: createCommentSSR,
                createHTMLNode: createHTMLNodeSSR,
                createSVGNode: createSVGNodeSSR,
                createText: createTextSSR,
                createDocumentFragment: createDocumentFragmentSSR
            }
        }
    }
}

const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment } = getCreators()

/* EXPORT */

export { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment }
// Export SSR versions for direct imports
export { createCommentSSR, createHTMLNodeSSR, createSVGNodeSSR, createTextSSR, createDocumentFragmentSSR }