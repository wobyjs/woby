import type { ObservableOptions } from "../types"
import type { CSSLength } from "./html-length"

// Define the structured representation of CSS box values
// Contains top, right, bottom, left properties with valueOf and toString methods
export interface CSSBoxObject {
    top: CSSLength
    right: CSSLength
    bottom: CSSLength
    left: CSSLength
    valueOf(): string
    toString(): string
}

export type CSSBoxValue = CSSLength | [CSSLength] | [CSSLength, CSSLength] | [CSSLength, CSSLength, CSSLength] | [CSSLength, CSSLength, CSSLength, CSSLength] | CSSBoxObject

// Helper function to parse CSS box values into a consistent object format
// Treats empty strings as undefined
// Supports single values, arrays (1-4 elements), and structured objects
// Plain numbers are treated as pixels (e.g., 1 -> 1px) through HtmlLength parsing
const parseCSSBox = (value: CSSBoxValue): CSSBoxObject | undefined => {
    // If it's an empty string, return undefined
    if (value === "") {
        return undefined
    }

    // If it's already a structured object, return it
    if (typeof value === 'object' && value !== null && 'top' in value && 'right' in value && 'bottom' in value && 'left' in value) {
        return {
            top: value.top,
            right: value.right,
            bottom: value.bottom,
            left: value.left,
            valueOf: () => `${value.top} ${value.right} ${value.bottom} ${value.left}`,
            toString: () => `${value.top} ${value.right} ${value.bottom} ${value.left}`
        }
    }

    // If it's an array, convert to object format following CSS shorthand rules
    if (Array.isArray(value)) {
        switch (value.length) {
            case 1: // All sides same
                return {
                    top: value[0],
                    right: value[0],
                    bottom: value[0],
                    left: value[0],
                    valueOf: () => `${value[0]}`,
                    toString: () => `${value[0]}`
                }
            case 2: // Top/bottom, left/right
                return {
                    top: value[0],
                    right: value[1],
                    bottom: value[0],
                    left: value[1],
                    valueOf: () => `${value[0]} ${value[1]}`,
                    toString: () => `${value[0]} ${value[1]}`
                }
            case 3: // Top, left/right, bottom
                return {
                    top: value[0],
                    right: value[1],
                    bottom: value[2],
                    left: value[1],
                    valueOf: () => `${value[0]} ${value[1]} ${value[2]}`,
                    toString: () => `${value[0]} ${value[1]} ${value[2]}`
                }
            case 4: // Top, right, bottom, left
                return {
                    top: value[0],
                    right: value[1],
                    bottom: value[2],
                    left: value[3],
                    valueOf: () => `${value[0]} ${value[1]} ${value[2]} ${value[3]}`,
                    toString: () => `${value[0]} ${value[1]} ${value[2]} ${value[3]}`
                }
        }
    }

    // If it's a single CSS length value, treat as all sides same
    if (typeof value === 'string' || typeof value === 'number') {
        return {
            top: value,
            right: value,
            bottom: value,
            left: value,
            valueOf: () => `${value}`,
            toString: () => `${value}`
        }
    }

    // Default fallback
    return {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        valueOf: () => '0px',
        toString: () => '0px'
    }
}

export const HtmlBox: ObservableOptions</* CSSBoxValue */ string> = {
    // Compare two CSS box values for equality
    // Handles undefined, string, and object values
    equals: (a, b) => {
        const boxA = parseCSSBox(a)
        const boxB = parseCSSBox(b)

        // If either is undefined, they're equal only if both are undefined
        if (boxA === undefined || boxB === undefined) {
            return boxA === boxB
        }

        return boxA.top === boxB.top &&
            boxA.right === boxB.right &&
            boxA.bottom === boxB.bottom &&
            boxA.left === boxB.left
    },
    type: Object,
    toHtml: (value) => {
        const box = parseCSSBox(value)
        if (box === undefined) return undefined as any
        return box.toString() as any
    },
    fromHtml: (value) => {
        if (typeof value !== 'string') return value
        const parts = value.split(' ').filter(part => part.length > 0)
        switch (parts.length) {
            case 1:
                return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0], valueOf: () => value, toString: () => value } as any //as CSSBoxObject
            case 2:
                return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1], valueOf: () => value, toString: () => value } as any //as CSSBoxObject
            case 3:
                return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1], valueOf: () => value, toString: () => value } as any //as CSSBoxObject
            case 4:
                return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3], valueOf: () => value, toString: () => value } as any //as CSSBoxObject
            default:
                return { top: '0px', right: '0px', bottom: '0px', left: '0px', valueOf: () => '0px', toString: () => '0px' } as any //as CSSBoxObject
        }
    }
}