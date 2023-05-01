import type { /* Child, EventListener, Fragment, */ FunctionMaybe, ObservableReadonly } from '../types';
export declare abstract class Callable<T, V> {
    protected observable: ObservableReadonly<V>;
    constructor(observable: ObservableReadonly<V>);
    init(observable: ObservableReadonly<V>): void;
    call(...args: any[]): void;
    cleanup(): void;
    abstract update(value: V, valuePrev?: V): void;
}
export declare class CallableClassStatic extends Callable<Record<string, boolean>, boolean> {
    private props;
    private key;
    constructor(observable: ObservableReadonly<boolean>, props: Record<string, boolean>, key: string);
    update(value: boolean): void;
}
export declare class CallableClassBooleanStatic<T> extends Callable<T, null | undefined | boolean | string> {
    private props;
    private value;
    constructor(observable: ObservableReadonly<null | undefined | boolean | string>, props: T, value: boolean);
    update(key: null | undefined | boolean | string, keyPrev?: null | undefined | boolean | string): void;
}
export declare class CallableClassesStatic<T> extends Callable<T, null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>> {
    private props;
    constructor(observable: ObservableReadonly<null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>>, props: T);
    update(object: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, objectPrev?: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>): void;
}
export declare class CallablePropertyStatic<T, V> extends Callable<T, V> {
    private props;
    private key;
    constructor(observable: ObservableReadonly<V>, props: T, key: string);
    update(value: V): void;
}
export declare class CallableStyleStatic<T> extends Callable<T, null | undefined | number | string> {
    private props;
    private key;
    constructor(observable: ObservableReadonly<null | undefined | number | string>, props: T, key: string);
    update(value: null | undefined | number | string): void;
}
export declare class CallableStylesStatic<T> extends Callable<T, null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>> {
    private props;
    constructor(observable: ObservableReadonly<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>>, props: HTMLElement);
    update(object: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, objectPrev?: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>): void;
}
