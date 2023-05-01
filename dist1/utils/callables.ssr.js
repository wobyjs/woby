/* IMPORT */
import { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN } from '../constants.js';
import useCleanup from '../hooks/use_cleanup.js';
import untrack from '../methods/untrack.js';
import { on, off } from 'oby';
import { setClassStatic, setClassBooleanStatic, setClassesStatic, /* setEventStatic,  */ setPropertyStatic, setStyleStatic, setStylesStatic } from './setters.ssr.js';
/* HELPERS */
const target = (observable) => (SYMBOL_OBSERVABLE_FROZEN in observable) ? observable : observable(SYMBOL_OBSERVABLE); //TSC
/* MAIN */
// These classes exist mainly as a memory-usage optimization, as they sometimes avoid keeping some functions in memory
export class Callable {
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
// export class CallableAttributeStatic<T, V> extends Callable<T, V> {
//     /* CONSTRUCTOR */
//     constructor(observable: ObservableReadonly<V>, private props: T, private key: string) {
//         super(observable)
//         this.init(observable)
//     }
//     /* API */
//     update(value: V): void {
//         setAttributeStatic(this.props, this.key, value)
//     }
// }
// class CallableChildStatic extends Callable<Child, any, any> {
//     /* VARIABLES */
//     private parent: HTMLElement
//     private fragment: Fragment
//     /* CONSTRUCTOR */
//     constructor(observable: ObservableReadonly<Child>, parent: HTMLElement, fragment: Fragment) {
//         super(observable)
//         this.parent = parent
//         this.fragment = fragment
//         this.init(observable)
//     }
//     /* API */
//     update(value: Child): void {
//         setChildStatic(this.parent, this.fragment, value, true)
//     }
// }
export class CallableClassStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, props, key) {
        super(observable);
        this.props = props;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setClassStatic(this.props, this.key, value);
    }
}
export class CallableClassBooleanStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, props, value) {
        super(observable);
        this.props = props;
        this.value = value;
        this.init(observable);
    }
    /* API */
    update(key, keyPrev) {
        setClassBooleanStatic(this.props, this.value, key, keyPrev);
    }
}
export class CallableClassesStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, props) {
        super(observable);
        this.props = props;
        this.init(observable);
    }
    /* API */
    update(object, objectPrev) {
        setClassesStatic(this.props, object, objectPrev);
    }
}
// export class CallableEventStatic extends Callable<T, null | undefined | EventListener> {
//     /* CONSTRUCTOR */
//     constructor(observable: ObservableReadonly<null | undefined | EventListener>, private props: HTMLElement, private event: string) {
//         super(observable)
//         this.init(observable)
//     }
//     /* API */
//     update(value: null | undefined | EventListener): void {
//         setEventStatic(this.props, this.event, value)
//     }
// }
export class CallablePropertyStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, props, key) {
        super(observable);
        this.props = props;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setPropertyStatic(this.props, this.key, value);
    }
}
export class CallableStyleStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, props, key) {
        super(observable);
        this.props = props;
        this.key = key;
        this.init(observable);
    }
    /* API */
    update(value) {
        setStyleStatic(this.props, this.key, value);
    }
}
export class CallableStylesStatic extends Callable {
    /* CONSTRUCTOR */
    constructor(observable, props) {
        super(observable);
        this.props = props;
        this.init(observable);
    }
    /* API */
    update(object, objectPrev) {
        setStylesStatic(this.props, object, objectPrev);
    }
}
/* EXPORT */
