import React from 'react'
import { Router as BaseRouter } from 'react-router'
import { RouterContext } from './RouterContext'
import { useStore } from '@/infrastructure/store/useStore'
import { RouterStore } from '@/infrastructure/router/RouterStore'

export interface RouterProps {
  children: React.ReactNode
  authenticated: boolean
  authPath: string
}

export const Router = ({ authenticated, authPath, children }: RouterProps) => {
  const { history } = useStore(RouterStore)
  return (
    <RouterContext.Provider value={{ isAuthenticated: authenticated, authenticationPath: authPath }}>
      <BaseRouter history={history}>{children}</BaseRouter>
    </RouterContext.Provider>
  )
}
