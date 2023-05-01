/* IMPORT */
import { useCleanup } from '../hooks/index.js';
import SuspenseContext from './suspense.context.js';
/* MAIN */
class SuspenseManager {
    constructor() {
        /* VARIABLES */
        this.suspenses = new Map();
        /* API */
        this.change = (suspense, nr) => {
            const counter = this.suspenses.get(suspense) || 0;
            const counterNext = Math.max(0, counter + nr);
            if (counter === counterNext)
                return;
            if (counterNext) {
                this.suspenses.set(suspense, counterNext);
            }
            else {
                this.suspenses.delete(suspense);
            }
            if (nr > 0) {
                suspense.increment(nr);
            }
            else {
                suspense.decrement(nr);
            }
        };
        this.suspend = () => {
            const suspense = SuspenseContext.get();
            if (!suspense)
                return;
            this.change(suspense, 1);
            useCleanup(() => {
                this.change(suspense, -1);
            });
        };
        this.unsuspend = () => {
            this.suspenses.forEach((counter, suspense) => {
                this.change(suspense, -counter);
            });
        };
    }
}
;
/* EXPORT */
export default SuspenseManager;
