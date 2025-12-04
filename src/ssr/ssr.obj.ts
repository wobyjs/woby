/**
 * SSR Custom Element Implementation for Woby Framework
 * 
 * This module provides a mock implementation of custom elements for server-side rendering
 * environments where browser APIs like customElements, window, and document are not available.
 * 
 * @module customElement.ssr
 */

import $ from "soby"
import type { Component, Child } from "../types"
import { isSSR } from "../constants"

// Type definitions for DOM APIs
type EventListener = (evt: Event) => void
type EventListenerObject = {
    handleEvent(object: Event): void
}
type EventListenerOrEventListenerObject = EventListener | EventListenerObject
type AddEventListenerOptions = boolean | {
    capture?: boolean
    once?: boolean
    passive?: boolean
}

// Simplified NodeList implementation for SSR
class SimpleNodeList {
    private nodes: any[]

    constructor(nodes: any[] = []) {
        this.nodes = nodes
    }

    get length() {
        return this.nodes.length
    }

    item(index: number) {
        return this.nodes[index] || null
    }

    [Symbol.iterator]() {
        return this.nodes[Symbol.iterator]()
    }
}

// Type definitions for MutationObserver
interface MutationObserverInit {
    childList?: boolean
    attributes?: boolean
    characterData?: boolean
    subtree?: boolean
    attributeOldValue?: boolean
    characterDataOldValue?: boolean
    attributeFilter?: string[]
}

interface MutationRecord {
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

type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void

// Base class with shared methods for all node types
export class BaseNode {
    nodeType: number
    attributes: Record<string, string>
    childNodes: any[]
    parentNode: any | null
    // Observable for tracking mutations
    _mutations$: any
    // List of observers watching this node
    _observers: Array<{ observer: MutationObserver, options: MutationObserverInit }> = []

    constructor(nodeType: number) {
        this.nodeType = nodeType
        this.attributes = {}
        this.childNodes = []
        this.parentNode = null
        // Create observable for mutations
        this._mutations$ = $([])
    }

    appendChild(child: any) {
        const previousSibling = this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null

        // Set the parent node
        if (child) {
            child.parentNode = this
        }

        this.childNodes.push(child)

        // Notify observers of childList mutation
        this._notifyMutation({
            type: 'childList',
            target: this,
            addedNodes: new SimpleNodeList([child]),
            removedNodes: new SimpleNodeList([]),
            previousSibling,
            nextSibling: null,
            attributeName: null,
            attributeNamespace: null,
            oldValue: null
        })

        return child
    }

    insertBefore(newNode: any, referenceNode: any) {
        if (referenceNode === null) {
            return this.appendChild(newNode)
        }

        const index = this.childNodes.indexOf(referenceNode)
        if (index === -1) {
            throw new Error('Reference node not found')
        }

        const previousSibling = index > 0 ? this.childNodes[index - 1] : null
        const nextSibling = referenceNode

        // Set the parent node
        if (newNode) {
            newNode.parentNode = this
        }

        this.childNodes.splice(index, 0, newNode)

        // Notify observers of childList mutation
        this._notifyMutation({
            type: 'childList',
            target: this,
            addedNodes: new SimpleNodeList([newNode]),
            removedNodes: new SimpleNodeList([]),
            previousSibling,
            nextSibling,
            attributeName: null,
            attributeNamespace: null,
            oldValue: null
        })

        return newNode
    }

    removeChild(child: any) {
        const index = this.childNodes.indexOf(child)
        if (index === -1) {
            throw new Error('Child node not found')
        }

        const previousSibling = index > 0 ? this.childNodes[index - 1] : null
        const nextSibling = index < this.childNodes.length - 1 ? this.childNodes[index + 1] : null

        // Remove the parent node reference
        if (child) {
            child.parentNode = null
        }

        this.childNodes.splice(index, 1)

        // Notify observers of childList mutation
        this._notifyMutation({
            type: 'childList',
            target: this,
            addedNodes: new SimpleNodeList([]),
            removedNodes: new SimpleNodeList([child]),
            previousSibling,
            nextSibling,
            attributeName: null,
            attributeNamespace: null,
            oldValue: null
        })

        return child
    }

    setAttribute(name: string, value: any) {
        const oldValue = this.attributes[name]
        const newValue = String(value)

        this.attributes[name] = newValue

        // Notify observers of attribute mutation
        this._notifyMutation({
            type: 'attributes',
            target: this,
            addedNodes: new SimpleNodeList([]),
            removedNodes: new SimpleNodeList([]),
            previousSibling: null,
            nextSibling: null,
            attributeName: name,
            attributeNamespace: null,
            oldValue: oldValue !== undefined ? oldValue : null
        })
    }

    removeAttribute(name: string) {
        const oldValue = this.attributes[name]

        if (oldValue !== undefined) {
            delete this.attributes[name]

            // Notify observers of attribute mutation
            this._notifyMutation({
                type: 'attributes',
                target: this,
                addedNodes: new SimpleNodeList([]),
                removedNodes: new SimpleNodeList([]),
                previousSibling: null,
                nextSibling: null,
                attributeName: name,
                attributeNamespace: null,
                oldValue
            })
        }
    }

    // Internal method to notify observers of mutations
    _notifyMutation(mutation: MutationRecord) {
        // Update the mutations observable
        const currentMutations = this._mutations$() || []
        const newMutations = [...currentMutations, mutation]
        this._mutations$(newMutations)

        // Notify all registered observers
        this._observers.forEach(({ observer, options }) => {
            const filteredMutations = observer['_filterMutations']([mutation], options)
            if (filteredMutations.length > 0) {
                observer['callback'](filteredMutations, observer)
            }
        })
    }

    // Method for MutationObserver to register itself
    _addObserver(observer: MutationObserver, options: MutationObserverInit) {
        this._observers.push({ observer, options })
    }

    // Method for MutationObserver to unregister itself
    _removeObserver(observer: MutationObserver) {
        const index = this._observers.findIndex(item => item.observer === observer)
        if (index !== -1) {
            this._observers.splice(index, 1)
        }
    }
}

// Mock MutationObserver for SSR environment
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

// Simple dictionary to store custom element definitions in SSR environment
const customElementsRegistry: Map<string, CustomElementConstructor> = new Map()

// Mock customElements object for SSR
export const customElements = {
    define: (tagName: string, component: CustomElementConstructor) => {
        customElementsRegistry.set(tagName, component)
    },

    get: (tagName: string) => {
        return customElementsRegistry.get(tagName)
    },

    whenDefined: async (tagName: string) => {
        // In SSR, we just return a resolved promise since all components are already defined
        return Promise.resolve()
    }
}

export const document = {
    // Map to store event listeners for better tracking
    _eventListeners: new Map<string, Array<{
        listener: EventListenerOrEventListenerObject
        options?: boolean | AddEventListenerOptions
    }>>(),

    addEventListener: function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        // Mock implementation for SSR - store listeners in map
        if (!this._eventListeners.has(type)) {
            this._eventListeners.set(type, [])
        }
        this._eventListeners.get(type)!.push({ listener, options })
    },

    removeEventListener: function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
        // Mock implementation for SSR - remove listeners from map
        if (this._eventListeners.has(type)) {
            const listeners = this._eventListeners.get(type)!
            const index = listeners.findIndex(item => item.listener === listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
        }
    },

    // Helper method to get listeners for testing/debugging
    _getEventListeners: function (type: string) {
        return this._eventListeners.get(type) || []
    }
}



if (isSSR) {
    globalThis.customElements = customElements as any
    globalThis.document = document as any
}