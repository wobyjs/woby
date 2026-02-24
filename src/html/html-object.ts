import type { ObservableOptions } from "soby"


// Helper function to convert HTML string values to Object using JSON.parse
// Treats empty strings and invalid JSON as undefined
const toObject = <T extends object>(value: T | string | undefined): T | undefined => {
    if (value === undefined || value === '') return undefined
    if (typeof value !== 'string') return value
    try {
        return HtmlObject.JSON.parse(value)
    } catch {
        return undefined
    }
}

export const HtmlObject: ObservableOptions<object | undefined> & { JSON: Omit<typeof JSON, 'toStringTag'> } = {
    /**
     * JSON implementation used for parsing and stringifying objects.
     * Consumers can replace this with alternative implementations like JSON5.
     */
    JSON,

    equals: (a: object | string, b: object | string) => {
        const objA = toObject(a)
        const objB = toObject(b)
        return (objA === undefined && objB === undefined) ||
            (objA !== undefined && objB !== undefined && HtmlObject.JSON.stringify(objA) === HtmlObject.JSON.stringify(objB))
    },
    type: Object,
    toHtml: (value) => {
        const obj = toObject(value)
        try {
            return obj ? HtmlObject.JSON.stringify(obj) : undefined as any
        } catch {
            return "" as any
        }
    },
    fromHtml: (value) => toObject(value) || {}
}