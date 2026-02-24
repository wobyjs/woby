import type { ObservableOptions } from "~/types"

// Helper function to convert HTML string values to BigInt
// Treats empty strings and invalid values as undefined
// Handles BigInt, number, and string inputs
const toBigInt = (value: bigint | string | number | undefined): bigint | undefined => {
    if (value === undefined || value === '') return undefined
    try {
        if (typeof value === 'bigint') return value
        if (typeof value === 'number') {
            if (!Number.isInteger(value)) return undefined
            return BigInt(value)
        }
        return BigInt(value)
    } catch {
        return undefined
    }
}

export const HtmlBigInt: ObservableOptions<bigint> = {
    equals: (a: bigint | string | number, b: bigint | string | number) => {
        const bigA = toBigInt(a)
        const bigB = toBigInt(b)
        return (bigA === undefined && bigB === undefined) ||
            (bigA !== undefined && bigB !== undefined && bigA === bigB)
    },
    type: BigInt,
    toHtml: (value) => {
        const big = toBigInt(value)
        return big ? big.toString() : undefined as any
    },
    fromHtml: (value) => toBigInt(value) || BigInt(0)
}