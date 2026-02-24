// Helper function to handle function values

import { ObservableOptions } from "soby"

// Functions cannot be meaningfully converted to HTML attributes, so we return undefined
const toFunctionString = (value: [Function] | null | undefined): string | undefined => {
    if (value === null || value === undefined) return undefined
    // Functions don't have a meaningful string representation for HTML attributes
    return undefined
}

export const HtmlFunction: ObservableOptions<[Function] | undefined> = {
    equals: (a: [Function] | null | undefined, b: [Function] | null | undefined) => {
        // Functions are compared by reference
        return a === b
    },
    type: [Function],
    toHtml: (value) => {
        const result = toFunctionString(value)
        return result as any
    },
    fromHtml: (value) => {
        // Functions cannot be meaningfully created from HTML strings
        return undefined as any
    }
}