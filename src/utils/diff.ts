/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * A DOM diffing algorithm that efficiently updates the DOM by calculating the minimum
 * number of operations needed to transform one list of nodes into another.
 * 
 * This implementation is based on udomdiff with customizations for the Woby framework:
 * - Added TypeScript types
 * - Removed accessor functions
 * - Added support for diffing unwrapped nodes
 * - Added safety checks for parent node consistency
 * 
 * The algorithm uses an optimized approach that:
 * 1. Handles fast paths for common operations (append, prepend, remove)
 * 2. Uses a mapping strategy for more complex rearrangements
 * 3. Minimizes DOM operations by finding the longest common subsequence
 * 
 * @module diff
 */

import { createComment } from "./creators"

// This is just a slightly customized version of udomdiff: with types, no accessor function and support for diffing unwrapped nodes

/** Dummy comment node used as a placeholder for wrapping single nodes */
const dummyNode = createComment('')

/** Wrapper array for single "before" nodes to normalize them as arrays */
const beforeDummyWrapper: [Node] = [dummyNode]

/** Wrapper array for single "after" nodes to normalize them as arrays */
const afterDummyWrapper: [Node] = [dummyNode]

/**
 * Efficiently diffs and updates the children of a parent node.
 * 
 * Compares two lists of DOM nodes ([before] and [after]) and applies the minimum
 * number of DOM operations needed to transform the parent's current children
 * to match the [after] list.
 * 
 * This is essential for reactive frameworks like Woby to efficiently update
 * the DOM when component state changes, avoiding costly re-renders.
 * 
 * @param parent - The parent DOM node whose children need to be updated
 * @param before - The current list of child nodes (or a single node)
 * @param after - The desired list of child nodes (or a single node)
 * @param nextSibling - The reference node for insertion operations, or null to append
 * 
 * @example
 * ```ts
 * // Update a parent's children from [nodeA, nodeB] to [nodeC, nodeA, nodeD]
 * diff(parentElement, [nodeA, nodeB], [nodeC, nodeA, nodeD], null)
 * // This will efficiently insert nodeC before nodeA, and append nodeD
 * ```
 */
export const diff = (parent: Node, before: Node | Node[], after: Node | Node[], nextSibling: Node | null): void => {
  if (before === after) return
  if (before instanceof Node) {
    if (after instanceof Node) {
      if (before.parentNode === parent) { // Safety check, since setChildStatic may trigger this
        parent.replaceChild(after, before)
        return
      } else {
        //TODO: Optimize this branch too
      }
    }
    beforeDummyWrapper[0] = before
    before = beforeDummyWrapper
  }
  if (after instanceof Node) {
    afterDummyWrapper[0] = after
    after = afterDummyWrapper
  }
  const bLength = after.length
  let aEnd = before.length
  let bEnd = bLength
  let aStart = 0
  let bStart = 0
  let map: Map<any, any> | null = null
  let removable: Node | undefined
  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      // we could be in a situation where the rest of nodes that
      // need to be added are not at the end, and in such case
      // the node to `insertBefore`, if the index is more than 0
      // must be retrieved, otherwise it's gonna be the first item.
      const node = bEnd < bLength ?
        (bStart ?
          (after[bStart - 1].nextSibling) :
          after[bEnd - bStart]) :
        nextSibling
      if (bStart < bEnd) {
        // parent.insertBefore(after[bStart++], node);
        if (node) {
          (node as ChildNode).before.apply(node, after.slice(bStart, bEnd))
        } else {
          (parent as ParentNode).append.apply(parent, after.slice(bStart, bEnd))
        }
        bStart = bEnd
      }
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        // remove the node only if it's unknown or not live
        if (!map || !map.has(before[aStart])) {
          removable = before[aStart]
          if (removable.parentNode === parent) { // Safety check, since setChildStatic may trigger this
            parent.removeChild(removable)
          }
        }
        aStart++
      }
    }
    // same node: fast path
    else if (before[aStart] === after[bStart]) {
      aStart++
      bStart++
    }
    // same tail: fast path
    else if (before[aEnd - 1] === after[bEnd - 1]) {
      aEnd--
      bEnd--
    }
    // The once here single last swap "fast path" has been removed in v1.1.0
    // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
    // reverse swap: also fast path
    else if (
      before[aStart] === after[bEnd - 1] &&
      after[bStart] === before[aEnd - 1]
    ) {
      // this is a "shrink" operation that could happen in these cases:
      // [1, 2, 3, 4, 5]
      // [1, 4, 3, 2, 5]
      // or asymmetric too
      // [1, 2, 3, 4, 5]
      // [1, 2, 3, 5, 6, 4]
      const node = before[--aEnd].nextSibling
      parent.insertBefore(
        after[bStart++],
        before[aStart++].nextSibling
      )
      parent.insertBefore(after[--bEnd], node)
      // mark the future index as identical (yeah, it's dirty, but cheap 👍)
      // The main reason to do this, is that when a[aEnd] will be reached,
      // the loop will likely be on the fast path, as identical to b[bEnd].
      // In the best case scenario, the next loop will skip the tail,
      // but in the worst one, this node will be considered as already
      // processed, bailing out pretty quickly from the map index check
      before[aEnd] = after[bEnd]
    }
    // map based fallback, "slow" path
    else {
      // the map requires an O(bEnd - bStart) operation once
      // to store all future nodes indexes for later purposes.
      // In the worst case scenario, this is a full O(N) cost,
      // and such scenario happens at least when all nodes are different,
      // but also if both first and last items of the lists are different
      if (!map) {
        map = new Map
        let i = bStart
        while (i < bEnd)
          map.set(after[i], i++)
      }
      // if it's a future node, hence it needs some handling
      if (map.has(before[aStart])) {
        // grab the index of such node, 'cause it might have been processed
        const index = map.get(before[aStart])
        // if it's not already processed, look on demand for the next LCS
        if (bStart < index && index < bEnd) {
          let i = aStart
          // counts the amount of nodes that are the same in the future
          let sequence = 1
          while (++i < aEnd && i < bEnd && map.get(before[i]) === (index + sequence))
            sequence++
          // effort decision here: if the sequence is longer than replaces
          // needed to reach such sequence, which would brings again this loop
          // to the fast path, prepend the difference before a sequence,
          // and move only the future list index forward, so that aStart
          // and bStart will be aligned again, hence on the fast path.
          // An example considering aStart and bStart are both 0:
          // a: [1, 2, 3, 4]
          // b: [7, 1, 2, 3, 6]
          // this would place 7 before 1 and, from that time on, 1, 2, and 3
          // will be processed at zero cost
          if (sequence > (index - bStart)) {
            const node = before[aStart]
            if (bStart < index) {
              // parent.insertBefore(after[bStart++], node);
              if (node) {
                (node as ChildNode).before.apply(node, after.slice(bStart, index))
              } else {
                (parent as ParentNode).append.apply(parent, after.slice(bStart, index))
              }
              bStart = index
            }
          }
          // if the effort wasn't good enough, fallback to a replace,
          // moving both source and target indexes forward, hoping that some
          // similar node will be found later on, to go back to the fast path
          else {
            parent.replaceChild(
              after[bStart++],
              before[aStart++]
            )
          }
        }
        // otherwise move the source forward, 'cause there's nothing to do
        else
          aStart++
      }
      // this node has no meaning in the future list, so it's more than safe
      // to remove it, and check the next live node out instead, meaning
      // that only the live list index should be forwarded
      else {
        removable = before[aStart++]
        if (removable.parentNode === parent) { // Safety check, since setChildStatic may trigger this
          parent.removeChild(removable)
        }
      }
    }
  }
  beforeDummyWrapper[0] = dummyNode
  afterDummyWrapper[0] = dummyNode
}