import React from 'react'
import Alert from '@material-ui/lab/Alert'
import { observe } from '@/infrastructure/store'

export function ResponseAlert({ resource }: { resource: {error?: any, data?: any } }) {
  return observe(resource, ({ error, data }) => {
    if (error) {
      return <Alert elevation={6} variant='filled' severity='error'>{JSON.stringify(resource.error)}</Alert>
    } else if (data) {
      return <Alert elevation={6} variant='filled' severity='success'>{JSON.stringify(resource.data)}</Alert>
    }
    return null
  })
}
