import React, { useEffect } from 'react'
import { useStore, observe } from '@/infrastructure/store'
import { Grid } from '@material-ui/core'
import { DocStore } from '@/app/Doc/DocStore'
import { useForm } from '@/app/components/Form/useForm'
import { DocItem } from '@/app/Doc/DocItem'
import { reaction } from 'mobx'
import { Layout } from '@/app/components/Layout/Layout'

export function Doc() {
  const docStore = useStore(DocStore)

  const checkinForm = useForm<{ username: string }>(() => ({
    data: { username: '' },
    onSubmit: ({username}) => docStore.doCheckin(username),
    validate: ({username}) => !!username
  }))

  const getGameForm = useForm<{ token: string }>(() => ({
    data: { token: '' },
    onSubmit: ({token}) => docStore.getGame(token),
    validate: ({token}) => !!token
  }))

  const createGameForm = useForm<{ token: string }>(() => ({
    data: { token: '' },
    onSubmit: ({token}) => docStore.createGame(token),
    validate: ({token}) => !!token
  }))

  const guessCharForm = useForm<{ character: string, token: string }>(() => ({
    data: { character: '', token: '' },
    onSubmit: ({character, token}) => docStore.makeGuess(character, token),
    validate: ({character, token}) => !!token && character.length === 1
  }))

  useEffect(() => reaction(() => docStore.checkin.token,result => {
    if (result) {
      [getGameForm, createGameForm, guessCharForm].forEach(form => form.handleChange(form.keys.token, result))
    }
  }),[])

  return observe(docStore, (
    {
      checkin,
      createGameResource,
      guessCharResource,
      getGameResource,
    }) => (
    <Layout title='Documentation'>
      <Grid item xs={12}>
        <DocItem
          type='POST'
          method='/checkin'
          description='Register with a username to get a token'
          form={checkinForm}
          resource={checkin.resource}
          fields={[{key: checkinForm.keys.username, label: 'User Name'}]}
          autoFocus
        />
        <DocItem
          type='POST'
          method='/guess'
          description='Make a guess by posting a single character'
          form={guessCharForm}
          resource={guessCharResource}
          fields={[
            {key: guessCharForm.keys.character, label: 'Character'},
            {key: guessCharForm.keys.token, label: 'Token'}
          ]}
        />
        <DocItem
          type='POST'
          method='/game'
          description='Create a new game for the registered user'
          form={createGameForm}
          resource={createGameResource}
          fields={[{key: createGameForm.keys.token, label: 'Token'}]}
        />
        <DocItem
          type='GET'
          method='/game'
          description='Get the latest game for the registered user'
          form={getGameForm}
          resource={getGameResource}
          fields={[{key: getGameForm.keys.token, label: 'Token'}]}
        />
      </Grid>
    </Layout>
  ))
}
