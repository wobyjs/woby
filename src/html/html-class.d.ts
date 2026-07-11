import type { ObservableOptions, FunctionMaybe } from "soby";
export type ClassValue = string | number | boolean | null | undefined | ClassArray | ClassDictionary | (() => ClassValue);
export interface ClassDictionary {
    [id: string]: FunctionMaybe<boolean | null | undefined>;
}
export interface ClassArray extends Array<ClassValue> {
}
export declare const HtmlClass: ObservableOptions<ClassValue | undefined>;
//# sourceMappingURL=html-class.d.ts.map