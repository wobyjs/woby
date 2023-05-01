import type { Child, EventListener, Fragment, FunctionMaybe, ObservableReadonly } from '../types';
declare abstract class Callable<T> {
    protected observable: ObservableReadonly<T>;
    constructor(observable: ObservableReadonly<T>);
    init(observable: ObservableReadonly<T>): void;
    call(): void;
    cleanup(): void;
    abstract update(value: T, valuePrev?: T): void;
}
declare class CallableAttributeStatic extends Callable<null | undefined | boolean | number | string> {
    private element;
    private key;
    constructor(observable: ObservableReadonly<null | undefined | boolean | number | string>, element: HTMLElement, key: string);
    update(value: null | undefined | boolean | number | string): void;
}
declare class CallableChildStatic extends Callable<Child> {
    private parent;
    private fragment;
    constructor(observable: ObservableReadonly<Child>, parent: HTMLElement, fragment: Fragment);
    update(value: Child): void;
}
declare class CallableClassStatic extends Callable<null | undefined | boolean> {
    private element;
    private key;
    constructor(observable: ObservableReadonly<null | undefined | boolean>, element: HTMLElement, key: string);
    update(value: null | undefined | boolean): void;
}
declare class CallableClassBooleanStatic extends Callable<null | undefined | boolean | string> {
    private element;
    private value;
    constructor(observable: ObservableReadonly<null | undefined | boolean | string>, element: HTMLElement, value: boolean);
    update(key: null | undefined | boolean | string, keyPrev?: null | undefined | boolean | string): void;
}
declare class CallableClassesStatic extends Callable<null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>> {
    private element;
    constructor(observable: ObservableReadonly<null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>>, element: HTMLElement);
    update(object: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, objectPrev?: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>): void;
}
declare class CallableEventStatic extends Callable<null | undefined | EventListener> {
    private element;
    private event;
    constructor(observable: ObservableReadonly<null | undefined | EventListener>, element: HTMLElement, event: string);
    update(value: null | undefined | EventListener): void;
}
declare class CallablePropertyStatic extends Callable<null | undefined | boolean | number | string> {
    private element;
    private key;
    constructor(observable: ObservableReadonly<null | undefined | boolean | number | string>, element: HTMLElement, key: string);
    update(value: null | undefined | boolean | number | string): void;
}
declare class CallableStyleStatic extends Callable<null | undefined | number | string> {
    private element;
    private key;
    constructor(observable: ObservableReadonly<null | undefined | number | string>, element: HTMLElement, key: string);
    update(value: null | undefined | number | string): void;
}
declare class CallableStylesStatic extends Callable<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>> {
    private element;
    constructor(observable: ObservableReadonly<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>>, element: HTMLElement);
    update(object: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, objectPrev?: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>): void;
}
export { Callable, CallableAttributeStatic, CallableChildStatic, CallableClassStatic, CallableClassBooleanStatic, CallableClassesStatic, CallableEventStatic, CallablePropertyStatic, CallableStyleStatic, CallableStylesStatic };
