import 'reflect-metadata'

type IConstruct<T> = new (...args: any[]) => T

let counter = 0
export function store<T extends IConstruct<any>>(constructor: T) {
  const uid = counter++
  Object.defineProperty(constructor, '::storeId', {
    value: `${constructor.name}-${uid}`
  })
  return constructor
}
