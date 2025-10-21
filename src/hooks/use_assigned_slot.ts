// /**
//  * Custom Element Implementation for Woby Framework
//  * 
//  * This module provides functionality to create custom HTML elements with reactive properties
//  * that integrate seamlessly with the Woby framework's observable system. Custom elements
//  * created with this API can be used both in JSX/TSX and directly in HTML.
//  * 
//  * Features:
//  * - Automatic attribute to prop mapping
//  * - Type conversion for observable props
//  * - Nested property support (e.g., 'nested$prop$value' or 'nested.prop.value' in HTML, 'nested$prop$value' in JSX)
//  * - Style property support (e.g., 'style$font-size' or 'style.font-size' in HTML, 'style$font-size' in JSX)
//  * - Automatic kebab-case to camelCase conversion for all property names
//  * - Automatic exclusion of properties with { toHtml: () => undefined } from HTML attributes
//  * - Shadow DOM encapsulation with optional stylesheet adoption
//  * - Context support for custom elements
//  * - Custom serialization using toHtml and fromHtml options
//  * 
//  * Style Encapsulation Options:
//  * - ignoreStyle: Set to true to prevent adoption of global stylesheets in shadow DOM
//  * 
//  * @module customElement
//  */

// import { $, $$, } from "../methods/soby"
// import { DEBUGGER } from "soby"
// import { useEffect } from "."
// import { jsx } from "../jsx-runtime"
// import { ObservableMaybe } from "~/types"
// import { useAttached, useLightDom } from "./use_attached"


// const isLightDom = (node: Node): boolean => {
//     let current: Node | null = node?.parentNode
//     while (current) {
//         if ((current as Element)?.shadowRoot) {
//             return true
//         }
//         current = current.parentNode
//     }
//     return false
// }

// export const useAssignedSlot = (ref?: ObservableMaybe<Node | null>, match?: (parent: Node | null) => boolean) => {
//     const isGiven = ref !== undefined
//     const slot = $<HTMLSlotElement>()

//     if (!ref)
//         ref = $<Node>()

//     const { lightDom } = useLightDom(ref)

//     useEffect(() => {
//         if (!$$(ref)) return
//         if (!$$(lightDom)) return

//         const updateParent = () => {
//             let currentParent: Node | null = $$(ref).parentNode

//             // If match function is provided, traverse up until match or root
//             if (match) {
//                 while (currentParent) {
//                     if (match(currentParent)) {
//                         lightDom(currentParent)
//                         return
//                     }
//                     currentParent = currentParent.parentNode
//                 }
//                 // If no match found, parent remains null
//                 lightDom(null)
//             } else {
//                 // Default behavior: return immediate parent
//                 lightDom(currentParent)
//             }
//         }

//         // Initial parent check
//         updateParent()

//         // Create a MutationObserver to watch for parent changes
//         const observer = new MutationObserver(() => {
//             updateParent()
//         })

//         // Start observing the parent element changes
//         observer.observe($$(ref).getRootNode() as Node, { subtree: true, childList: true })

//         // Cleanup observer on unmount
//         return () => observer.disconnect()
//     })

//     // Return the reference node
//     return {
//         parent: lightDom,
//         mount: isGiven ? undefined : jsx('comment', { ref, data: DEBUGGER.verboseComment ? 'attached' : '' }),
//         ref
//     }
// }

