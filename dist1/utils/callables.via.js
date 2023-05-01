/* IMPORT */
import { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN } from '../constants.js';
import useCleanup from '../hooks/use_cleanup.js';
import untrack from '../methods/untrack.js';
import { on, off } from 'oby';
import { setAttributeStatic, setChildStatic, setClassStatic, setClassBooleanStatic, setClassesStatic, setEventStatic, setPropertyStatic, setStyleStatic, setStylesStatic } from './setters.via.js';
/* HELPERS */
const target = (observable) => (SYMBOL_OBSERVABLE_FROZEN in observable) ? observable : observable(SYMBOL_OBSERVABLE); //TSC
/* MAIN */
// These classes exist mainly as a memory-usage optimization, as they sometimes avoid keeping some functions in memory
class Callable {
    /* CONSTRUCTOR */
    constructor(observable) {
        this.observable = target(observable);
    }
    /* API */
    init(observable) {
        on(this.observable, this);
        this.call(observable, untrack(observable));
        useCleanup(this);
    }
    call(...args) {
        if (args.length === 1) {
            this.cleanup();
        }
        else {
            this.update(args[1], args[2]);
        }
    }
    cleanup() {
        off(this.observable, this);
    }
}
const debugHTML = (p, name) => {
    if (p)
        (async () => {
            const nn = await get(p.nodeName);
            const nt = await get(p.nodeType);
            const html = await get(p.parentElement.outerHTML);
            console.log(name, p, nn, nt, html);
        })();
};
class CallableAttributeStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element, key) {
        super(observable);
        this.element = element;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setAttributeStatic(this.element, this.key, value);
    }
}
class CallableChildStatic extends Callable {
    /* VARIABLES */
    /* CONSTRUCTOR */
    constructor(observable, parent /* , fragment: Fragment */) {
        super(observable);
        this.parent = parent;
        this.init(observable);
    }
    /* API */
    update(value) {
        setChildStatic(this.parent, value, true);
    }
}
class CallableClassStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element, key) {
        super(observable);
        this.element = element;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setClassStatic(this.element, this.key, value);
    }
}
class CallableClassBooleanStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element, value) {
        super(observable);
        this.element = element;
        this.value = value;
        this.init(observable);
    }
    /* API */
    update(key, keyPrev) {
        setClassBooleanStatic(this.element, this.value, key, keyPrev);
    }
}
class CallableClassesStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element) {
        super(observable);
        this.element = element;
        this.init(observable);
    }
    /* API */
    update(object, objectPrev) {
        setClassesStatic(this.element, object, objectPrev);
    }
}
class CallableEventStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element, event) {
        super(observable);
        this.element = element;
        this.event = event;
        this.init(observable);
    }
    /* API */
    update(value) {
        const { element, event } = this;
        setEventStatic(element, event, value);
    }
}
class CallablePropertyStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element, key) {
        super(observable);
        this.element = element;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setPropertyStatic(this.element, this.key, value);
    }
}
class CallableStyleStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element, key) {
        super(observable);
        this.element = element;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setStyleStatic(this.element, this.key, value);
    }
}
class CallableStylesStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, element) {
        super(observable);
        this.element = element;
        this.init(observable);
    }
    /* API */
    update(object, objectPrev) {
        setStylesStatic(this.element, object, objectPrev);
    }
}
/* EXPORT */
export { Callable, CallableAttributeStatic, CallableChildStatic, CallableClassStatic, CallableClassBooleanStatic, CallableClassesStatic, CallableEventStatic, CallablePropertyStatic, CallableStyleStatic, CallableStylesStatic };
