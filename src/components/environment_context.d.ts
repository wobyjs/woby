import type { SSRDocument } from '../ssr/document';
export type EnvironmentType = 'browser' | 'ssr' | 'via';
export declare const EnvironmentContext: {
    Provider: <C extends () => R, R>(env: EnvironmentType, callback: any) => unknown;
};
export declare const useEnvironment: () => EnvironmentType;
export declare const DocumentContext: {
    Provider: <C extends () => R, R>(doc: SSRDocument, callback: C) => R;
};
export declare const useDocument: () => SSRDocument | null;
export declare const showEnvLog = false;
//# sourceMappingURL=environment_context.d.ts.map