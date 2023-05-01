import type { Child, FunctionMaybe } from '../types';
declare const Suspense: ({ when, fallback, children }: {
    when?: FunctionMaybe<unknown>;
    fallback?: Child;
    children: Child;
}) => any;
export default Suspense;
