import { isObservable } from "soby"
import { $$ } from "."


export type ElementAttributes<T extends (...args: any) => any> = JSX.HTMLAttributes<HTMLElement> & Parameters<T>[0]

export const customElement = <P>(tagName: string, attributes: (keyof (P & JSX.HTMLAttributes<HTMLElement>))[], children: JSX.Component<P>) => {
    const C = class extends HTMLElement {
        static __children__ = children;
        static observedAttributes: string[] = attributes as any
        public props: P

        // constructor() {
        //     super()
        // }
        connectedCallback() {
            const { props } = this
            const keys = Object.keys(props).filter(item => !C.observedAttributes.includes(item))

            keys.forEach(k => this.removeAttribute(k))
        }
        // disconnectedCallback() {
        // }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log(
                `Attribute ${name} has changed from ${oldValue} to ${newValue}.`
            )

            if (oldValue === newValue) return

            const val = this.props[name]
            if (isObservable(val))
                if (typeof $$(val) === 'number')
                    val(+newValue)
                else
                    val(newValue)
            else
                this.props[name] = newValue
        }
    }

    customElements.define(tagName, C)

    return C
}
