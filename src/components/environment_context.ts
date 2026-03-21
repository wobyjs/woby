// import { useContext } from '../hooks'
// import { createContext } from '../methods'
import { context } from '../soby'
import type { SSRDocument } from '../ssr/document'

const EnvironmentToken = Symbol('ENV')
const DocumentToken = Symbol('DOC')

export type EnvironmentType = 'browser' | 'ssr' | 'via'
export const EnvironmentContext = { Provider: <C extends () => R, R>(env: EnvironmentType, callback) => context({ [EnvironmentToken]: env }, callback) }
export const useEnvironment = (): EnvironmentType => context(EnvironmentToken) //useContext(EnvironmentContext)

// Document context for SSR - provides access to current document instance
export const DocumentContext = {
    Provider: <C extends () => R, R>(doc: SSRDocument, callback: C): R => context({ [DocumentToken]: doc }, callback)
}
export const useDocument = (): SSRDocument | null => {
    try {
        return context(DocumentToken) as SSRDocument | undefined
    } catch {
        return null
    }
}

export const showEnvLog = false