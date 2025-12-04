/**
 * Type definitions for MutationObserver
 */

export interface MutationObserverInit {
    childList?: boolean
    attributes?: boolean
    characterData?: boolean
    subtree?: boolean
    attributeOldValue?: boolean
    characterDataOldValue?: boolean
    attributeFilter?: string[]
}