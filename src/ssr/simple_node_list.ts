/**
 * Simplified NodeList implementation for SSR
 */

export class SimpleNodeList {
    private nodes: any[]

    constructor(nodes: any[] = []) {
        this.nodes = nodes
    }

    get length() {
        return this.nodes.length
    }

    item(index: number) {
        return this.nodes[index] || null
    }

    [Symbol.iterator]() {
        return this.nodes[Symbol.iterator]()
    }
}