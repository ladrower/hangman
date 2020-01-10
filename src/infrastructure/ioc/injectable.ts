import 'reflect-metadata'

type IConstruct<T> = new (...args: any[]) => T

const key = Symbol('injectable')
const container = new WeakMap()

export class UndefinedDependencyException {}

export class UnresolvedDependencyException<T extends new () => any> {
  constructor(readonly dependency: T) {}
}

export const injector = {
  has<T>(type: IConstruct<T>): boolean {
    return container.has(type)
  },
  resolve<T>(constructor: IConstruct<T>, argsFrom: number): any[] | never {
    return getDependencies(constructor, argsFrom)
  },
  provide<T>(type: IConstruct<T>, value: T) {
    container.set(type, value)
    return this
  },
  invalidate<T>(type: IConstruct<T>) {
    container.delete(type)
    return this
  }
}

/**
 * @injectable class decorator
 * Forces TS to emit metadata and lazily maps instance for IoC container
 */
export function injectable<T extends IConstruct<any>>(constructor: T) {
  const C = class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      const meta = Reflect.getOwnMetadata(key, C)
      if (meta.injecting && !container.has(C)) {
        container.set(C, this)
      }
    }
  }
  Reflect.defineMetadata(
    key,
    {
      injecting: false
    },
    C
  )
  Object.defineProperty(C, 'name', {
    value: constructor.name
  })
  return C
}

function getDependencies<T>(constructor: IConstruct<T>, skip: number): any[] | never {
  const types = Reflect.getMetadata('design:paramtypes', constructor) || []

  return (skip > 0 ? types.slice(skip) : types).map((type: IConstruct<any>) => {
    if (type == null) {
      throw new UndefinedDependencyException()
    }
    if (container.has(type)) {
      return container.get(type)
    }
    if (Reflect.hasOwnMetadata(key, type)) {
      const meta = Reflect.getOwnMetadata(key, type)
      meta.injecting = true
      const instance = new type(...getDependencies(type, 0))
      meta.injecting = false
      return instance
    }
    throw new UnresolvedDependencyException(type)
  })
}
