import type { Disposer, FN, FunctionMaybe, ObservableMaybe } from '../types';
import { Stack } from '../soby';
export declare const useScheduler: <T, U>({ loop, once, callback, cancel, schedule, stack }: {
    loop?: FunctionMaybe<boolean>;
    once?: boolean;
    callback: ObservableMaybe<FN<[U]>>;
    cancel: FN<[T]>;
    schedule: ((callback: FN<[U]>) => T);
    stack: Stack;
}) => Disposer;
//# sourceMappingURL=use_scheduler.d.ts.map