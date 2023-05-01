/* IMPORT */
import useReaction from './use_reaction.js';
import $ from '../methods/S.js';
import { isFunction, isNil } from '../utils/lang.js';
/* MAIN */
//TODO: Maybe port this to oby
const useGuarded = (value, guard) => {
    const guarded = $();
    useReaction(() => {
        const current = isFunction(value) ? value() : value;
        if (!guard(current))
            return;
        guarded(() => current);
    });
    return () => {
        const current = guarded();
        if (isNil(current))
            throw new Error('The value never passed the type guard');
        return current;
    };
};
/* EXPORT */
export default useGuarded;
