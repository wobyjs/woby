import type { Child, ChildWithMetadata, FunctionMaybe, ObservableReadonly } from '../types';
export declare const Switch: {
    <T>({ when, fallback, children }: {
        when: FunctionMaybe<T>;
        fallback?: Child;
        children: Child;
    }): ObservableReadonly<Child>;
    Case<T>({ when, children }: {
        when: T;
        children: Child;
    }): ChildWithMetadata<[T, Child]>;
    Default({ children }: {
        children: Child;
    }): ChildWithMetadata<[Child]>;
};
//# sourceMappingURL=switch.d.ts.map