
/* IMPORT */

import { SuspenseManager } from '../components/suspense.manager'
import { useCheapDisposed } from '../hooks/use_cheap_disposed'
import { useReadonly } from '../hooks/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { $ } from '../methods/soby'
import { $$ } from '../methods/soby'
import { assign, castError, isPromise } from '../utils/lang'
import type { ObservableMaybe, PromiseMaybe, ResourceStaticPending, ResourceStaticRejected, ResourceStaticResolved, ResourceStatic, ResourceFunction, Resource } from '../types'

/* MAIN */

//TODO: Maybe port this to soby, as "from"
//TODO: Option for returning the resource as a store, where also the returned value gets wrapped in a store
//FIXME: SSR demo: toggling back and forth between /home and /loader is buggy, /loader gets loaded with no data, which is wrong

export const useResource = <T>(fetcher: (() => ObservableMaybe<PromiseMaybe<T>>)): Resource<T> => {

  const pending = $(true)
  const error = $<Error>()
  const value = $<T>()
  const latest = $<T>()

  const { suspend, unsuspend } = new SuspenseManager()
  //@ts-ignore
  const resourcePending: ResourceStaticPending<T> = { pending: true, get value(): undefined { return void suspend() }, get latest(): T | undefined { return latest() ?? void suspend() } }
  const resourceRejected: ResourceStaticRejected = { pending: false, get error(): Error { return error()! }, get value(): never { throw error()! }, get latest(): never { throw error()! } }
  const resourceResolved: ResourceStaticResolved<T> = { pending: false, get value(): T { return value()! }, get latest(): T { return value()! } }
  const resourceFunction: ResourceFunction<T> = { pending: () => pending(), error: () => error(), value: () => resource().value, latest: () => resource().latest }
  const resource = $<ResourceStatic<T>>(resourcePending)

  const stack = new Error()

  useRenderEffect(() => {

    const disposed = useCheapDisposed()

    const onPending = (): void => {

      pending(true)
      error(undefined)
      value(undefined)
      resource(resourcePending)

    }

    const onResolve = (result: T): void => {

      if (disposed()) return

      pending(false)
      error(undefined)
      value(() => result)
      latest(() => result)
      resource(resourceResolved)

    }

    const onReject = (exception: unknown): void => {

      if (disposed()) return

      pending(false)
      error(castError(exception))
      value(undefined)
      latest(undefined)
      resource(resourceRejected)

    }

    const fetch = (): void => {

      try {

        const value = $$(fetcher())

        if (isPromise(value)) {

          onPending()

          value.then(onResolve, onReject)
          value.then(unsuspend, unsuspend)

        } else {

          onResolve(value)

        }

      } catch (error: unknown) {

        onReject(error)

      }

    }

    fetch()
  }, stack)

  return assign(useReadonly(resource, stack), resourceFunction)

}
