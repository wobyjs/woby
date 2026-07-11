import type { ObservableOptions } from "soby";
export type CSSUnit = `${number}px` | `${number}em` | `${number}rem` | `${number}%` | `${number}vh` | `${number}vw` | `${number}vmin` | `${number}vmax` | `${number}ch` | `${number}ex` | `${number}pt` | `${number}pc` | `${number}in` | `${number}cm` | `${number}mm`;
export type CSSLength = CSSUnit | "auto" | "inherit" | "initial" | "unset" | "" | string | number;
export interface CSSLengthObject {
    value: number;
    unit: string;
    valueOf(): string;
    toString(): string;
}
export declare const HtmlLength: ObservableOptions</* CSSLength | CSSLengthObject | */ /* CSSLength | CSSLengthObject | */ number | string | undefined>;
//# sourceMappingURL=html-length.d.ts.map