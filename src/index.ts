import { useCallback, useEffect, useState } from 'react'

type ServiceType<T> = () => Promise<T>

type SetterType<T> = (data: T) => void

type StoreHookType<T> = () => [T, SetterType<T>]

type ReactionType = () => void

function createStoreHook<T>(defaultValue: T): StoreHookType<T>
function createStoreHook<T>(
  initialValue: T,
  service?: ServiceType<T>
): StoreHookType<T> {
  let store: T = initialValue
  let fetchPromise: Promise<T> | null
  let reactions: ReactionType[] = []

  const setStoreFn = (data: T) => {
    store = data

    // Call reactions
    reactions.forEach(fn => fn())
  }

  const useStoreFn: StoreHookType<T> = () => {
    const [current, setCurrent] = useState<T>(store)

    const reaction = useCallback(() => {
      setCurrent(store)
    }, [])

    useEffect(() => {
      const run = async () => {
        const currentFetchPromise = (fetchPromise = fetchPromise ?? service!())
        store = await currentFetchPromise
        fetchPromise = null
        setCurrent(store)
      }

      if (service && !store) {
        run()
      }

      reactions.push(reaction)

      return () => {
        reactions = reactions.filter(f => reaction !== f)
      }
    }, [])

    return [current, setStoreFn]
  }

  return useStoreFn
}

export default createStoreHook