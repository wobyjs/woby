/**
 * Custom Element Implementation for Woby Framework
 * 
 * This module provides functionality to create custom HTML elements with reactive properties
 * that integrate seamlessly with the Woby framework's observable system. Custom elements
 * created with this API can be used both in JSX/TSX and directly in HTML.
 * 
 * Features:
 * - Automatic attribute to prop mapping
 * - Type conversion for observable props
 * - Nested property support (e.g., 'nested$prop$value' or 'nested.prop.value' in HTML, 'nested$prop$value' in JSX)
 * - Style property support (e.g., 'style$font-size' or 'style.font-size' in HTML, 'style$font-size' in JSX)
 * - Automatic kebab-case to camelCase conversion for all property names
 * - Automatic exclusion of properties with { toHtml: () => undefined } from HTML attributes
 * - Shadow DOM encapsulation with optional stylesheet adoption
 * - Context support for custom elements
 * - Custom serialization using toHtml and fromHtml options
 * 
 * Style Encapsulation Options:
 * - ignoreStyle: Set to true to prevent adoption of global stylesheets in shadow DOM
 * 
 * @module customElement
 */

import { $, $$, } from "../methods/soby"
import { DEBUGGER, isObservable } from "soby"
import { useEffect, useMemo } from "../hooks"
import { jsx } from "../jsx-runtime"
import { ObservableMaybe } from "~/types"
import { mark } from "../utils/mark"

export const useAttached = (ref?: ObservableMaybe<Node | null>, match?: (parent: Node | null) => boolean) => {
    const isGiven = !!ref

    if (!ref)
        ref = $<Node>()

    const parent = $<Node | null>(null)

    const fn = () => {
        if (!$$(ref)) return

        const updateParent = () => {
            let currentParent: Node | null = $$(ref)?.parentNode || null

            // If match function is provided, traverse up until match or root
            if (match) {
                while (currentParent) {
                    if (match(currentParent)) {
                        parent(currentParent)
                        return !!currentParent
                    }
                    // traversed through assignedSlot 1st, 
                    currentParent = (currentParent as HTMLElement).assignedSlot ?? currentParent.parentNode ?? (currentParent as ShadowRoot).host
                }
                // If no match found, parent remains null
                parent(null)
                return false
            } else {
                // Default behavior: return immediate parent
                parent(currentParent)
                return !!currentParent
            }
        }

        // Initial parent check
        if (updateParent()) return

        const callback: MutationCallback = (mutationsList, observer) => {
            if (mutationsList[0]?.type === 'childList') {
                // Check nodes that were added
                if (updateParent()) {
                    observer.disconnect()
                    return
                }
            }
            // Cleanup observer on unmount
            // return () => observer.disconnect()
        }

        const observer = new MutationObserver(callback)

        // 5. Configuration options
        const config: MutationObserverInit = {
            childList: true, // Crucial: Watch for children being added/removed
            subtree: true    // Optional: Watch all descendants, not just direct children
        }

        // 6. Start observing
        observer.observe(document, config)

        return () => observer.disconnect()
    }

    if (isObservable(ref))
        useEffect(fn)
    else
        fn()

    // Return the reference node
    return {
        parent,
        mount: isGiven ? undefined : mark('attached', ref),
        ref
    }
}


// export const isLightDom = (node: Node) =>
//     useMemo(() => $$(useAttached(node, (parent): parent is Element => !!parent && 'shadowRoot' in parent).parent))
export const useLightDom = (ref?: ObservableMaybe<Node | null>) => {
    // const { parent, mount, ref: r } = useAttached(ref, (parent): parent is Element => (!!(parent as Element).shadowRoot && !!parent.parentElement?.assignedSlot))
    const { parent, mount, ref: r } = useAttached(ref, (parent): parent is Element => !!(parent as Element).assignedSlot)
    // const lightDom = useMemo(() => $$(parent)?.parentElement)

    // // Observable to track if slot is assigned
    // const slotAssigned = $<boolean>(false)

    // // Effect to observe shadow root and slot changes
    // useEffect(() => {
    //     const lightDomElement = $$(lightDom)
    //     if (!lightDomElement?.parentElement) return

    //     const parentElement = lightDomElement.parentElement
    //     let shadowRoot: ShadowRoot | null = null

    //     // Function to check if shadow root is ready
    //     const checkShadowRoot = () => {
    //         shadowRoot = parentElement.shadowRoot
    //         if (shadowRoot) {
    //             // Shadow root is ready, now observe for slots
    //             observeSlots()
    //             return true
    //         }
    //         return false
    //     }

    //     // Function to observe slots
    //     const observeSlots = () => {
    //         if (!shadowRoot) return

    //         // Check if there are already slots
    //         const slots = Array.from(shadowRoot.querySelectorAll('slot'))
    //         if (slots.length > 0) {
    //             // Slots exist, start listening to slot change events
    //             listenToSlotChanges(slots)
    //             return
    //         }

    //         // No slots yet, observe for when they are added
    //         const slotObserver = new MutationObserver((mutations) => {
    //             for (const mutation of mutations) {
    //                 if (mutation.type === 'childList') {
    //                     mutation.addedNodes.forEach((node) => {
    //                         if (node.nodeName === 'SLOT') {
    //                             // Slot added, start listening to slot change events
    //                             slotObserver.disconnect()
    //                             listenToSlotChanges([node as HTMLSlotElement])
    //                         }
    //                     })
    //                 }
    //             }
    //         })

    //         slotObserver.observe(shadowRoot, { childList: true, subtree: true })

    //         // Cleanup slot observer
    //         return () => slotObserver.disconnect()
    //     }

    //     // Function to listen to slot change events
    //     const listenToSlotChanges = (slots: Node[]) => {
    //         const slotElements: HTMLSlotElement[] = []
    //         for (const slot of slots) {
    //             if (slot instanceof HTMLSlotElement) {
    //                 slotElements.push(slot)
    //                 // Add event listener for slot change
    //                 slot.addEventListener('slotchange', () => {
    //                     // Update slot assigned observable
    //                     slotAssigned(true)
    //                 })
    //             }
    //         }

    //         // // Initial check for assigned nodes
    //         // for (const slot of slotElements) {
    //         //     if (slot.assignedNodes().length > 0) {
    //         //         slotAssigned(true)
    //         //         break
    //         //     }
    //         // }
    //     }

    //     // Check if shadow root is already ready
    //     if (!checkShadowRoot()) {
    //         // Shadow root not ready yet, observe for when it becomes available
    //         const shadowObserver = new MutationObserver(() => {
    //             if (checkShadowRoot()) {
    //                 shadowObserver.disconnect()
    //             }
    //         })

    //         shadowObserver.observe(parentElement, { attributes: true })

    //         // Cleanup shadow observer
    //         return () => shadowObserver.disconnect()
    //     }
    // })

    return { lightDom: parent, mount, ref: r }
}