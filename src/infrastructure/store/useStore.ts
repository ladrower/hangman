import { useContext } from 'react'
import { StoreContext } from '@/infrastructure/store/StoreContext'
import { createNew } from '@/infrastructure/ioc'

export function useStore<T>(constructor: new (...args: any[]) => T): T {
  const scope = useContext(StoreContext)

  if (!scope.hasOwnProperty(constructor['::storeId'])) {
    throw new Error(`No scope found for store ${constructor.name}`)
  }

  const reference = scope[constructor['::storeId']]

  if (!reference.instance) {
    reference.instance = createNew(constructor)
  }

  return reference.instance
}
