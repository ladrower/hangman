export interface IResource<T, E = any> {
  readonly loading?: boolean
  readonly error?: E
  readonly data?: T
}

export * from './HttpReader'