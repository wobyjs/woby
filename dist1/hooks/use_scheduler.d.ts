import type { Disposer, FN, FunctionMaybe, ObservableMaybe } from '../types';
declare const useScheduler: <T, U>({ loop, callback, cancel, schedule }: {
    loop?: FunctionMaybe<boolean>;
    callback: any;
    cancel: FN<[T], void>;
    schedule: (callback: FN<[U], void>) => T;
}) => Disposer;
export default useScheduler;
