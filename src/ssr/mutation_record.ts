/**
 * Type definitions for MutationRecord
 */

import type { SimpleNodeList } from './simple_node_list'

export interface MutationRecord {
    type: string
    target: any
    addedNodes: SimpleNodeList
    removedNodes: SimpleNodeList
    previousSibling: any | null
    nextSibling: any | null
    attributeName: string | null
    attributeNamespace: string | null
    oldValue: string | null
}