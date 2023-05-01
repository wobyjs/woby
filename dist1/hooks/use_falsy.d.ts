import type { FunctionMaybe, Falsy } from '../types';
declare const useFalsy: <T>(value: FunctionMaybe<T>) => () => Extract<T, false | void | "" | 0 | 0n>;
export default useFalsy;
