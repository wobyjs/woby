import type { FunctionMaybe } from '../types';
declare const useGuarded: <T, U extends T>(value: FunctionMaybe<T>, guard: (value: T) => value is U) => () => U;
export default useGuarded;
