/**
 * Base class with shared methods for all node types
 */

import $ from "soby"
import type { Component } from "../types"
import { SimpleNodeList } from './simple_node_list'
import type { MutationRecord } from './mutation_record'
import type { MutationObserverInit } from './mutation_observer_init'

export class BaseNode {
    nodeType: number
    attributes: Record<string, string>
    childNodes: any[]
    parentNode: any | null
    // Observable for tracking mutations
    _mutations$: any
    // List of observers watching this node
    _observers: Array<{ observer: any, options: MutationObserverInit }> = []
    // ClassList implementation
    classList: {
        toggle: (className: string, force?: boolean) => boolean
    }
    // Event listener implementation
    _eventListeners: Map<string, Array<(event: any) => void>>
    // Node type constants
    static readonly ELEMENT_NODE = 1
    static readonly ATTRIBUTE_NODE = 2
    static readonly TEXT_NODE = 3
    static readonly CDATA_SECTION_NODE = 4
    static readonly ENTITY_REFERENCE_NODE = 5
    static readonly ENTITY_NODE = 6
    static readonly PROCESSING_INSTRUCTION_NODE = 7
    static readonly COMMENT_NODE = 8
    static readonly DOCUMENT_NODE = 9
    static readonly DOCUMENT_TYPE_NODE = 10
    static readonly DOCUMENT_FRAGMENT_NODE = 11
    static readonly NOTATION_NODE = 12
    // Instance properties for Node type access
    readonly ELEMENT_NODE = 1
    readonly ATTRIBUTE_NODE = 2
    readonly TEXT_NODE = 3
    readonly CDATA_SECTION_NODE = 4
    readonly ENTITY_REFERENCE_NODE = 5
    readonly ENTITY_NODE = 6
    readonly PROCESSING_INSTRUCTION_NODE = 7
    readonly COMMENT_NODE = 8
    readonly DOCUMENT_NODE = 9
    readonly DOCUMENT_TYPE_NODE = 10
    readonly DOCUMENT_FRAGMENT_NODE = 11
    readonly NOTATION_NODE = 12

    constructor(nodeType: number) {
        this.nodeType = nodeType
        this.attributes = {}
        this.childNodes = []
        this.parentNode = null
        // Create observable for mutations
        this._mutations$ = $([])
        // Initialize classList with toggle method
        this.classList = {
            toggle: (className: string, force?: boolean): boolean => {
                const currentClass = this.attributes['class'] || ''
                const classes = currentClass ? currentClass.split(' ').filter(c => c) : []
                const index = classes.indexOf(className)
                const hasClass = index !== -1

                // If force is not provided, toggle the class
                if (force === undefined) {
                    if (hasClass) {
                        classes.splice(index, 1)
                    } else {
                        classes.push(className)
                    }
                } else {
                    // If force is provided, add or remove based on force value
                    if (force && !hasClass) {
                        classes.push(className)
                    } else if (!force && hasClass) {
                        classes.splice(index, 1)
                    }
                }

                // Update the class attribute
                const newClass = classes.join(' ')
                if (newClass !== currentClass) {
                    this.setAttribute('class', newClass)
                }

                return force !== undefined ? force : !hasClass
            }
        }
        // Initialize event listeners map
        this._eventListeners = new Map()
    }

    addEventListener(type: string, listener: (event: any) => void) {
        if (!this._eventListeners.has(type)) {
            this._eventListeners.set(type, [])
        }
        const listeners = this._eventListeners.get(type)!
        if (!listeners.includes(listener)) {
            listeners.push(listener)
        }
    }

    removeEventListener(type: string, listener: (event: any) => void) {
        if (this._eventListeners.has(type)) {
            const listeners = this._eventListeners.get(type)!
            const index = listeners.indexOf(listener)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }

    dispatchEvent(event: any) {
        const eventType = event.type
        if (this._eventListeners.has(eventType)) {
            const listeners = this._eventListeners.get(eventType)!
            for (const listener of listeners) {
                listener(event)
            }
        }
        // Return true to indicate the event was not cancelled
        return true
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

    append(...nodes: any[]) {
        nodes.forEach(node => {
            this.appendChild(node)
        })
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

    replaceChild(newChild: any, oldChild: any) {
        const index = this.childNodes.indexOf(oldChild)
        if (index === -1) {
            throw new Error('Old child node not found')
        }

        // Remove the parent reference from old child
        oldChild.parentNode = null

        // Set the parent node for new child
        if (newChild) {
            newChild.parentNode = this
        }

        // Replace the child
        this.childNodes[index] = newChild

        // Notify observers of childList mutation
        this._notifyMutation({
            type: 'childList',
            target: this,
            addedNodes: new SimpleNodeList([newChild]),
            removedNodes: new SimpleNodeList([oldChild]),
            previousSibling: index > 0 ? this.childNodes[index - 1] : null,
            nextSibling: index < this.childNodes.length - 1 ? this.childNodes[index + 1] : null,
            attributeName: null,
            attributeNamespace: null,
            oldValue: null
        })

        return oldChild
    }

    replaceWith(...nodes: any[]) {
        if (!this.parentNode) {
            return // Nothing to replace if no parent
        }

        // Convert any text nodes to actual nodes if needed
        const normalizedNodes = nodes.map(node => {
            if (typeof node === 'string') {
                // Create a text node if it's a string
                // We can't import Text here due to circular dependency, so we'll create a basic text node
                const textNode = {
                    nodeType: 3, // Text node type
                    data: node,
                    nodeValue: node,
                    textContent: node,
                    parentNode: this.parentNode,
                    toString: () => node,
                    appendChild: () => { },
                    insertBefore: () => { },
                    removeChild: () => { },
                    replaceWith: () => { },
                    // Add other required methods/properties as needed
                }
                return textNode
            }
            // Set parent node for each node being inserted
            if (node && typeof node === 'object') {
                node.parentNode = this.parentNode
            }
            return node
        })

        const parent = this.parentNode
        const index = parent.childNodes.indexOf(this)

        if (index !== -1) {
            // Replace this node with the new nodes
            parent.childNodes.splice(index, 1, ...normalizedNodes)

            // Update parent reference for the replaced node
            this.parentNode = null

            // Notify observers of childList mutation
            this._notifyMutation({
                type: 'childList',
                target: parent,
                addedNodes: new SimpleNodeList(normalizedNodes),
                removedNodes: new SimpleNodeList([this]),
                previousSibling: index > 0 ? parent.childNodes[index - 1] : null,
                nextSibling: index < parent.childNodes.length ? parent.childNodes[index] : null,
                attributeName: null,
                attributeNamespace: null,
                oldValue: null
            })
        }
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
    _addObserver(observer: any, options: MutationObserverInit) {
        this._observers.push({ observer, options })
    }

    // Method for MutationObserver to unregister itself
    _removeObserver(observer: any) {
        const index = this._observers.findIndex(item => item.observer === observer)
        if (index !== -1) {
            this._observers.splice(index, 1)
        }
    }

    // Getter for nextSibling - finds this node's position in parent's childNodes
    get nextSibling(): any | null {
        if (this.parentNode && Array.isArray(this.parentNode.childNodes)) {
            const index = this.parentNode.childNodes.indexOf(this)
            return index !== -1 && index < this.parentNode.childNodes.length - 1
                ? this.parentNode.childNodes[index + 1]
                : null
        }
        return null
    }

    // Getter for previousSibling - finds this node's position in parent's childNodes
    get previousSibling(): any | null {
        if (this.parentNode && Array.isArray(this.parentNode.childNodes)) {
            const index = this.parentNode.childNodes.indexOf(this)
            return index > 0 ? this.parentNode.childNodes[index - 1] : null
        }
        return null
    }

    // Getter for firstChild
    get firstChild(): any | null {
        return this.childNodes.length > 0 ? this.childNodes[0] : null
    }

    // Getter for lastChild
    get lastChild(): any | null {
        return this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null
    }

    // Getter for isConnected (checks if node is connected to a document)
    get isConnected(): boolean {
        let parent: any = this.parentNode
        while (parent) {
            if (parent.nodeType === 9) { // Document node type
                return true
            }
            parent = parent.parentNode
        }
        return false
    }

    // Getter for baseURI (returns empty string as basic implementation)
    get baseURI(): string {
        return ''
    }

    // Getter for nodeName (returns empty string for nodes, tag name for elements)
    get nodeName(): string {
        return ''
    }

    // Getter for ownerDocument (returns null as basic implementation)
    get ownerDocument(): any | null {
        return null
    }

    // Getter for parentElement (returns parent if it's an element)
    get parentElement(): any | null {
        return this.parentNode
    }

    // Basic cloneNode implementation
    cloneNode(deep: boolean = false): any {
        // This is a basic implementation - subclasses should override
        const cloned = new (this.constructor as any)()
        cloned.nodeType = this.nodeType
        cloned.attributes = { ...this.attributes }
        if (deep && this.childNodes.length > 0) {
            cloned.childNodes = this.childNodes.map((child: any) => child.cloneNode?.(deep) || child)
        }
        return cloned
    }

    // Stub implementations for remaining Node interface methods
    compareDocumentPosition(other: any): number {
        return 0
    }

    contains(other: any): boolean {
        return false
    }

    getRootNode(): any {
        return this.ownerDocument || this
    }

    hasChildNodes(): boolean {
        return this.childNodes.length > 0
    }

    // Additional Node interface stubs
    isDefaultNamespace(prefix: string): boolean {
        return false
    }

    isEqualNode(other: any): boolean {
        return this === other
    }

    isSameNode(other: any): boolean {
        return this === other
    }

    lookupNamespaceURI(prefix: string): string | null {
        return null
    }

    lookupPrefix(namespaceURI: string): string | null {
        return null
    }

    normalize(): void {
        // No-op
    }

    cloneRange?(): any {
        return this.cloneNode(true)
    }
}