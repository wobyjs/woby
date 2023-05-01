import type { FragmentNode, FragmentFragment, Fragment } from '../types';
declare const FragmentUtils: {
    make: () => Fragment;
    makeWithNode: (node: Node) => FragmentNode;
    makeWithFragment: (fragment: Fragment) => FragmentFragment;
    getChildrenFragmented: (thiz: Fragment, children?: Node[]) => Node[];
    getChildren: (thiz: Fragment) => Node | Node[];
    pushFragment: (thiz: Fragment, fragment: Fragment) => void;
    pushNode: (thiz: Fragment, node: Node) => void;
    pushValue: (thiz: Fragment, value: Node | Fragment) => void;
    replaceWithNode: (thiz: Fragment, node: Node) => void;
    replaceWithFragment: (thiz: Fragment, fragment: Fragment) => void;
};
export default FragmentUtils;
