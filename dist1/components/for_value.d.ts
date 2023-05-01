import type { Child, FunctionMaybe, ObservableReadonly } from '../types';
type Valued<T = unknown> = T extends ObservableReadonly<infer U> ? ObservableReadonly<U> : ObservableReadonly<T>;
declare const ForValue: <T>({ values, fallback, children }: {
    values: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    children: (value: Valued<T>, index: any) => Child;
}) => any;
export default ForValue;
