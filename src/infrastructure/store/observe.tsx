import React from 'react'
import { Observer } from 'mobx-react'

export function observe<T>(subject: T, render: (subject: T) => React.ReactNode) {
  return <Observer>{() => render(subject)}</Observer>
}
