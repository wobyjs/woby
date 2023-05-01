import type { Child, FunctionMaybe, ObservableReadonly } from '../types';
declare const For: <T>({ values, fallback, children }: {
    values: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    children: (value: T, index: any) => Child;
}) => any;
export default For;
