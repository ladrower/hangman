import React from 'react'
import { Redirect, Route, Router, Switch } from '@/infrastructure/router'
import { useStore, observe } from '@/infrastructure/store'
import { AuthStore } from '@/app/Auth/AuthStore'
import { Auth } from '@/app/Auth/Auth'
import { Welcome } from '@/app/Welcome/Welcome'
import { Doc } from '@/app/Doc/Doc'
import { Play } from '@/app/Play/Play'
import { DocStore } from '@/app/Doc/DocStore'
import { PlayStore } from '@/app/Play/PlayStore'

export const App = () => {
  const auth = useStore(AuthStore).init()

  return observe(auth, ({ authenticated }) => (
    <Router authenticated={authenticated} authPath="/auth">
      <Switch>
        <Route path="/auth" component={Auth} isPublic />
        <Route path="/welcome" component={Welcome} isPublic />
        <Route path="/documentation" component={Doc} store={DocStore} isPublic />
        <Route path="/play" component={Play} store={PlayStore} />

        <Redirect from="*" to="/welcome" />
      </Switch>
    </Router>
  ))
}
