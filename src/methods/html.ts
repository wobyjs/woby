import htm from 'htm'
import { isSSR } from '../constants'
import { createElement as createElementSSR } from '../methods/create_element.ssr'
import { createElement as createElementClient } from '../methods/create_element'
import { assign } from '../utils/lang'
import type { Child, ComponentsMap, Element, Props } from '../types'

/* HELPERS */

const registry: ComponentsMap = {}
const getCreateElement = () => isSSR ? createElementSSR : createElementClient
const h = (type: string, props?: Props | null, ...children: Child[]): Element => getCreateElement()((registry[type] || type) as any, props, ...children)
const register = (components: ComponentsMap): void => void assign(registry, components)


export const html = assign(htm.bind(h), { register })