import type { ObservableOptions } from "soby";
export interface CSSColorObject {
    r: number;
    g: number;
    b: number;
    valueOf(): string;
    toString(): string;
}
export type CSSColorValue = string | number | CSSColorObject;
export declare const HtmlColor: ObservableOptions</* CSSColorValue */ /* CSSColorValue */ string | undefined>;
//# sourceMappingURL=html-color.d.ts.map