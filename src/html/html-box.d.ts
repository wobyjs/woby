import type { ObservableOptions } from "soby";
import type { CSSLength } from "./html-length";
export interface CSSBoxObject {
    top: CSSLength;
    right: CSSLength;
    bottom: CSSLength;
    left: CSSLength;
    valueOf(): string;
    toString(): string;
}
export type CSSBoxValue = CSSLength | [CSSLength] | [CSSLength, CSSLength] | [CSSLength, CSSLength, CSSLength] | [CSSLength, CSSLength, CSSLength, CSSLength] | CSSBoxObject;
export declare const HtmlBox: ObservableOptions</* CSSBoxValue */ /* CSSBoxValue */ string | undefined>;
//# sourceMappingURL=html-box.d.ts.map