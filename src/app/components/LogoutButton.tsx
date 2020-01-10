import React from 'react'
import { observe, useStore } from '@/infrastructure/store'
import { Button } from '@material-ui/core'
import { AuthStore } from '@/app/Auth/AuthStore'

export function LogoutButton() {
  const auth = useStore(AuthStore)

  return observe(auth, ({authenticated}) => authenticated ? (
      <Button color='inherit' onClick={() => auth.logout()}>
        Logout
      </Button>
    ) : null
  )
}
