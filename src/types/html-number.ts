import type { ObservableOptions } from "~/types"

// Helper function to convert HTML string values to number
// Treats empty strings and non-numeric values as NaN
const toNumber = (value: number | string | undefined): number => {
    if (value === undefined || value === '') return NaN
    if (typeof value === 'number') return value
    const num = Number(value)
    return isNaN(num) ? NaN : num
}

export const HtmlNumber: ObservableOptions<number> = {
    equals: (a: number | string, b: number | string) => toNumber(a) === toNumber(b),
    type: Number,
    toHtml: (value) => {
        const num = toNumber(value)
        return isNaN(num) ? undefined as any : String(num)
    },
    fromHtml: (value) => toNumber(value)
}