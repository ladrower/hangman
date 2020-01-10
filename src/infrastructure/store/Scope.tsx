import React from 'react'
import { StoreContext } from './StoreContext'

type IConstruct<T> = new (...args: any[]) => T

interface ScopeProps {
  children: React.ReactNode
  store: IConstruct<any> | IConstruct<any>[]
}

export class Scope extends React.Component<ScopeProps> {
  private scope: {
    [storeId: string]: null | {}
  } | null = null

  render() {
    const { children, store } = this.props
    return (
      <StoreContext.Consumer>
        {(parentScope) => {
          if (!this.scope) {
            const scope = {}
            const stores = Array.isArray(store) ? store : [store]
            stores.forEach((store) => {
              scope[store['::storeId']] = {
                instance: null
              }
            })
            this.scope = Object.assign({}, parentScope, scope)
          }
          return <StoreContext.Provider value={this.scope}>{children}</StoreContext.Provider>
        }}
      </StoreContext.Consumer>
    )
  }
}
