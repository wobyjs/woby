import type { Child, FunctionMaybe, Indexed, ObservableReadonly } from '../types';
export declare function For<T>({ values, fallback, unkeyed, children }: {
    values: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    unkeyed?: false;
    children: ((value: T, index: FunctionMaybe<number>) => Child);
}): ObservableReadonly<Child>;
export declare function For<T>({ values, fallback, unkeyed, children }: {
    values: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    unkeyed: true;
    children: ((value: Indexed<T>, index: FunctionMaybe<number>) => Child);
}): ObservableReadonly<Child>;
//# sourceMappingURL=for.d.ts.map