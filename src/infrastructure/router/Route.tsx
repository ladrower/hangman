import React from 'react'
import { useContext } from 'react'
import { Redirect, Route as BaseRoute, RouteComponentProps, RouteProps } from 'react-router'
import { RouterStore } from './RouterStore'
import { RouterContext } from './RouterContext'
import { useStore, observe, Scope } from '@/infrastructure/store'

type IConstruct<T> = new (...args: any[]) => T

type RouteComponent<P> =
  | {
      new (props: P, ...args: any[]): React.Component<P>
    }
  | React.FunctionComponent<P>

interface Props extends RouteProps {
  isPublic?: boolean
  store?: IConstruct<any> | IConstruct<any>[]
  component: RouteComponent<RouteComponentProps<any>>
}

export const Route = (props: Props) => {
  const { component: Component, isPublic, store, ...rest } = props
  const router = useStore(RouterStore)
  const { isAuthenticated, authenticationPath } = useContext(RouterContext)
  const shouldRender = isPublic || isAuthenticated

  return observe(router, ({ location }) => (
    <BaseRoute
      {...rest}
      location={location}
      render={(props) => {
        if (shouldRender) {
          const component = <Component {...props} />
          return store ? <Scope store={store}>{component}</Scope> : component
        }
        return <Redirect to={authenticationPath} />
      }}
    />
  ))
}
