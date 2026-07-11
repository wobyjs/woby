/**
 * Mock MutationObserver for SSR environment
 */
import type { BaseNode } from './base_node';
import type { MutationObserverInit } from './mutation_observer_init';
import type { MutationRecord } from './mutation_record';
/**
 * Callback type for MutationObserver
 */
export type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void;
export declare class MutationObserver {
    private callback;
    private observedElements;
    private pendingMutations;
    constructor(callback: MutationCallback);
    observe(target: BaseNode, options?: MutationObserverInit): void;
    disconnect(): void;
    takeRecords(): MutationRecord[];
    private _filterMutations;
    static simulateMutation(target: BaseNode, record: MutationRecord): void;
}
//# sourceMappingURL=mutation_observer.d.ts.map