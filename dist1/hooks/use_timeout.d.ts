import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types';
declare const useTimeout: (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>) => Disposer;
export default useTimeout;
