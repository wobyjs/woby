import type { DirectiveFunction, Directive, DirectiveOptions, ExtractArray } from '../types';
export declare const createDirective: <T extends keyof JSX.Directives>(name: T, fn: DirectiveFunction<ExtractArray<JSX.Directives[T]>>, options?: DirectiveOptions) => Directive<ExtractArray<JSX.Directives[T]>>;
//# sourceMappingURL=create_directive.d.ts.map