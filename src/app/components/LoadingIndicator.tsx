import { observe } from '@/infrastructure/store'
import React from 'react'

type Props = {
  resource: { loading?: boolean }
  component: React.ComponentType
}

export function LoadingIndicator(
  {
    resource,
    component: Component
  }: Props) {
  return observe(resource, ({loading }) => loading ? <Component /> : null)
}
