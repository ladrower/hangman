import { injector } from './injectable'

export * from './injectable'

export const createNew = <T>(constructor: new (...args: any[]) => T) => {
  return new constructor(...injector.resolve(constructor, 0))
}
