import type { FunctionMaybe, Truthy } from '../types';
declare const useTruthy: <T>(value: FunctionMaybe<T>) => () => Exclude<T, false | void | "" | 0 | 0n>;
export default useTruthy;
