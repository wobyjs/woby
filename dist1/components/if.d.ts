import type { Child, FunctionMaybe, Truthy } from '../types';
declare const If: <T>({ when, fallback, children }: {
    when: FunctionMaybe<T>;
    fallback?: Child;
    children: Child | ((value: () => Exclude<T, false | void | "" | 0 | 0n>) => Child);
}) => any;
export default If;
