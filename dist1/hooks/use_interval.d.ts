import type { Callback, Disposer, FunctionMaybe, ObservableMaybe } from '../types';
declare const useInterval: (callback: ObservableMaybe<Callback>, ms?: FunctionMaybe<number>) => Disposer;
export default useInterval;
