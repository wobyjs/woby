import type { Child } from '../types'

export const Fragment = ({ children, ...props }: { children?: Child }): Child => {

    return children

}
