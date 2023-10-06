import type { DirectiveFunction, Directive, DirectiveOptions } from '../types';
declare const createDirective: <T extends never>(name: T, fn: DirectiveFunction<JSX.Directives[T]>, options?: DirectiveOptions) => Directive<T>;
export default createDirective;
