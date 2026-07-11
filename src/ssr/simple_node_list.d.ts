/**
 * Simplified NodeList implementation for SSR
 */
export declare class SimpleNodeList {
    private nodes;
    constructor(nodes?: any[]);
    get length(): number;
    item(index: number): any;
    [Symbol.iterator](): ArrayIterator<any>;
}
//# sourceMappingURL=simple_node_list.d.ts.map