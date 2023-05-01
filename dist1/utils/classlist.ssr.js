/* IMPORT */
import { isString } from './lang.js';
/* MAIN */
// This function exists to optimize memory usage in some cases, where the classList API won't be touched without sacrificing performance
const classesToggle = (props, classes, force) => {
    const { className } = props;
    /* OPTIMIZED PATH */
    if (isString(className)) {
        if (!className) { // Optimized addition/deletion
            if (force) { // Optimized addition
                props.className = classes;
                return;
            }
            else { // Optimized deletion, nothing to do really
                return;
            }
        }
        else if (!force && className === classes) { // Optimized deletion
            props.className = '';
            return;
        }
    }
    /* REGULAR PATH */
    if (classes.includes(' ')) {
        classes.split(' ').forEach(cls => {
            if (!cls.length)
                return;
            props.classList.toggle(cls, !!force);
        });
    }
    else {
        props.classList.toggle(classes, !!force);
    }
};
/* EXPORT */
export { classesToggle };
