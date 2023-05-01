import type { SuspenseData } from '../types';
declare class SuspenseManager {
    private suspenses;
    change: (suspense: SuspenseData, nr: number) => void;
    suspend: () => void;
    unsuspend: () => void;
}
export default SuspenseManager;
