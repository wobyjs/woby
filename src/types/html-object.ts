import type { ObservableOptions } from "~/types"

// Helper function to convert HTML string values to Object using JSON.parse
// Treats empty strings and invalid JSON as undefined
const toObject = <T extends object>(value: T | string | undefined): T | undefined => {
    if (value === undefined || value === '') return undefined
    if (typeof value !== 'string') return value
    try {
        return JSON.parse(value)
    } catch {
        return undefined
    }
}

export const HtmlObject: ObservableOptions<object> = {
    equals: (a: object | string, b: object | string) => {
        const objA = toObject(a)
        const objB = toObject(b)
        return (objA === undefined && objB === undefined) ||
            (objA !== undefined && objB !== undefined && JSON.stringify(objA) === JSON.stringify(objB))
    },
    type: Object,
    toHtml: (value) => {
        const obj = toObject(value)
        try {
            return obj ? JSON.stringify(obj) : undefined as any
        } catch {
            return "" as any
        }
    },
    fromHtml: (value) => toObject(value) || {}
}