import type { Child, ChildWithMetadata, FunctionMaybe } from '../types';
declare const Portal: ({ when, mount, wrapper, children }: {
    mount?: Child;
    when?: FunctionMaybe<boolean>;
    wrapper?: Child;
    children?: Child;
}) => ChildWithMetadata<{
    portal: HTMLElement;
}>;
export default Portal;
