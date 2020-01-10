import React from 'react'
import { Switch as BaseSwitch } from 'react-router'
import { Route } from '@/infrastructure/router/index'

export const Switch = (props: { children: React.ReactElement[] }) => (
  <BaseSwitch>
    {props.children.map((child, index) => {
      // we want the Routes that have Stores to be unique
      // so that if two Routes define the same Store to be provided for their children
      // then each Route would get a new isolate instance of that Store
      // and also the other Stores defined would be re-instantiated when the Route changes
      return child.type === Route && child.props.hasOwnProperty('stores')
        ? React.cloneElement(child, { key: index })
        : child
    })}
  </BaseSwitch>
)
