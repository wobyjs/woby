import type { Child, FunctionMaybe, ObservableReadonly } from '../types';
type Indexed<T = unknown> = T extends ObservableReadonly<infer U> ? ObservableReadonly<U> : ObservableReadonly<T>;
declare const ForIndex: <T>({ values, fallback, children }: {
    values: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    children: (value: Indexed<T>, index: number) => Child;
}) => any;
export default ForIndex;
