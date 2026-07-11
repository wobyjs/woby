import type { FragmentNode, FragmentFragment, Fragment } from '../types';
import type { Comment as CommentSSR } from '../ssr/comment';
export declare const FragmentUtils: {
    make: () => Fragment;
    makeWithNode: (node: Node) => FragmentNode;
    makeWithFragment: (fragment: Fragment) => FragmentFragment;
    getChildrenFragmented: (thiz: Fragment, children?: (Node | Comment | CommentSSR)[]) => (Node | Comment | CommentSSR)[];
    getChildren: (thiz: Fragment) => (Node | Node | Comment | CommentSSR | Comment)[];
    pushFragment: (thiz: Fragment, fragment: Fragment) => void;
    pushNode: (thiz: Fragment, node: Node | Comment | CommentSSR) => void;
    pushValue: (thiz: Fragment, value: Node | Fragment | Comment | CommentSSR) => void;
    replaceWithNode: (thiz: Fragment, node: Node) => void;
    replaceWithFragment: (thiz: Fragment, fragment: Fragment) => void;
};
//# sourceMappingURL=fragment.d.ts.map