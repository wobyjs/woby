import type { Callback, Child, FN } from '../types';
declare const ErrorBoundary: ({ fallback, children }: {
    fallback: Child | FN<[{
        error: Error;
        reset: Callback;
    }], Child>;
    children: Child;
}) => any;
export default ErrorBoundary;
