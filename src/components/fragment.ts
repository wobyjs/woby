
/* IMPORT */

import type { Child } from '../types';

/* MAIN */

const Fragment = ({ children, ...props }: { children: Child; }): Child => {

    return children;

};

/* EXPORT */

export default Fragment;
