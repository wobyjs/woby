// import { useContext } from '../hooks'
// import { createContext } from '../methods'
import { context } from '../soby'

const EnvironmentToken = Symbol('ENV')

export type EnvironmentType = 'browser' | 'ssr' | 'via'
export const EnvironmentContext = { Provider: <C extends () => R, R>(env: EnvironmentType, callback) => context({ [EnvironmentToken]: env }, callback) }
export const useEnvironment = (): EnvironmentType => context(EnvironmentToken) //useContext(EnvironmentContext)

export const showEnvLog = false