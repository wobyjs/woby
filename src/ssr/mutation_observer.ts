/**
 * Mock MutationObserver for SSR environment
 */

import type { BaseNode } from './base_node'
import type { MutationObserverInit } from './mutation_observer_init'
import type { MutationRecord } from './mutation_record'
import { SimpleNodeList } from './simple_node_list'

/**
 * Callback type for MutationObserver
 */
export type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void

export class MutationObserver {
    private callback: MutationCallback
    private observedElements: Map<BaseNode, MutationObserverInit> = new Map()
    private pendingMutations: MutationRecord[] = []

    constructor(callback: MutationCallback) {
        this.callback = callback
    }

    observe(target: BaseNode, options?: MutationObserverInit): void {
        this.observedElements.set(target, options || {})

        // Register this observer with the target
        target._addObserver(this, options || {})
    }

    disconnect(): void {
        // Unregister this observer from all targets
        this.observedElements.forEach((options, target) => {
            target._removeObserver(this)
        })
        this.observedElements.clear()
        this.pendingMutations = []
    }

    takeRecords(): MutationRecord[] {
        const records = [...this.pendingMutations]
        this.pendingMutations = []
        return records
    }

    // Helper method to filter mutations based on observer options
    private _filterMutations(mutations: MutationRecord[], options: MutationObserverInit): MutationRecord[] {
        return mutations.filter(mutation => {
            if (mutation.type === 'childList' && options.childList) {
                return true
            }
            if (mutation.type === 'attributes' && options.attributes) {
                // If attributeFilter is specified, check if the attribute is in the filter
                if (options.attributeFilter && mutation.attributeName) {
                    return options.attributeFilter.includes(mutation.attributeName)
                }
                return true
            }
            return false
        })
    }

    // Helper method to simulate mutations for testing
    static simulateMutation(target: BaseNode, record: MutationRecord): void {
        if (target._mutations$) {
            const currentMutations = target._mutations$() || []
            target._mutations$([...currentMutations, record])
        }
    }
}