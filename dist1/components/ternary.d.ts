import type { Child, FunctionMaybe } from '../types';
declare const Ternary: ({ when, children }: {
    when: FunctionMaybe<unknown>;
    children: [Child, Child];
}) => any;
export default Ternary;
