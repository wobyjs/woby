/* IMPORT */
import useReaction from './use_reaction.js';
import useResolved from './use_resolved.js';
import $$ from '../methods/SS.js';
import { castArray } from '../utils/lang.js';
function useEventListener(target, event, handler, options) {
    return useReaction(() => {
        const fn = $$(handler, false);
        return useResolved([target, event, options], (target, event, options) => {
            const targets = castArray(target);
            targets.forEach(target => {
                target?.addEventListener(event, fn, options);
            });
            return () => {
                targets.forEach(target => {
                    target?.removeEventListener(event, fn, options);
                });
            };
        });
    });
}
/* EXPORT */
export default useEventListener;
