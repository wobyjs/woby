/* IMPORT */
import { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN } from '../constants.js';
import useCleanup from '../hooks/use_cleanup.js';
import untrack from '../methods/untrack.js';
import { on, off } from '../oby.js';
import { setAttributeStatic, setChildStatic, setClassStatic, setClassBooleanStatic, setClassesStatic, setEventStatic, setPropertyStatic, setStyleStatic, setStylesStatic } from './setters.js';
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
        // @ts-ignore
        this.call(observable, untrack(observable));
        useCleanup(this);
    }
    call() {
        if (arguments.length === 1) {
            this.cleanup();
        }
        else {
            this.update(arguments[1], arguments[2]);
        }
    }
    cleanup() {
        off(this.observable, this);
    }
}
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
    /* CONSTRUCTOR */
    constructor(observable, parent, fragment) {
        super(observable);
        this.parent = parent;
        this.fragment = fragment;
        this.init(observable);
    }
    /* API */
    update(value) {
        setChildStatic(this.parent, this.fragment, value, true);
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
        setEventStatic(this.element, this.event, value);
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
