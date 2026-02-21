import type { JSX, Observable } from '../../../src/ssr';
type Constructor<T, Args extends unknown[] = unknown[]> = new (...args: Args) => T;
export declare const TEST_INTERVAL = 500;
export declare const assert: (result: boolean, message?: string) => void;
export declare const random: () => number;
export declare const randomBigInt: () => bigint;
export declare const randomColor: () => string;
export declare const testObservables: Record<string, Observable<any>>;
export declare const registerTestObservable: (name: string, observable: Observable<any>) => void;
export declare const useInterval: (callback: any, delay: any) => void;
export declare const TestSnapshots: ({ Component, props }: {
    Component: (JSX.Component | Constructor<Component>) & {
        test: {
            static?: boolean;
            wrap?: boolean;
            snapshots?: string[];
            compareActualValues?: boolean;
            expect?: () => string;
        };
        name?: string;
    };
    props?: Record<any, any>;
}) => JSX.Element;
export {};
//# sourceMappingURL=util.d.ts.map