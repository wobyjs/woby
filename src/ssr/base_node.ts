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
}