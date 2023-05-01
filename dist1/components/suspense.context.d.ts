import type { SuspenseData } from '../types';
declare const SuspenseContext: {
    new: () => SuspenseData;
    create: () => SuspenseData;
    get: () => SuspenseData | undefined;
    set: (data: SuspenseData) => void;
};
export default SuspenseContext;
