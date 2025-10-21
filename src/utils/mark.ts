import { ObservableMaybe } from "../types"
import { jsx } from "../jsx-runtime"
import { DEBUGGER } from "soby"

export const mark = (msg: string, ref: ObservableMaybe<Node | null>) => DEBUGGER.verboseComment ?
    jsx('comment', { ref, data: msg }) : jsx('text', { ref })