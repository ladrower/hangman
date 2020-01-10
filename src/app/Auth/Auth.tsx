import React, { useEffect } from 'react'
import { observe, useStore } from '@/infrastructure/store'
import { AuthStore } from '@/app/Auth/AuthStore'
import { RouterStore } from '@/infrastructure/router/RouterStore'
import { Box, Button, Card, CardContent, LinearProgress } from '@material-ui/core'
import { Layout } from '@/app/components/Layout/Layout'
import { useForm } from '@/app/components/Form/useForm'
import { reaction } from 'mobx'
import { InputField } from '@/app/components/Form/InputField/InputField'
import { Form } from '@/app/components/Form/Form'

export function Auth() {
  const auth = useStore(AuthStore)
  const router = useStore(RouterStore)

  const loginForm = useForm<{ username: string }>(() => ({
    data: { username: '' },
    onSubmit: ({username}) => auth.login(username),
    validate: ({username}) => !!username
  }))

  useEffect(() => auth.logout(), [])

  useEffect(() => reaction(() => auth.authenticated,result => {
    if (result) {
      router.navigate('/play')
    }
  }),[])

  return observe(auth, ({ authenticating }) => (
    <Layout title='Login'>
      <Card style={{width: '100%', margin: 30}}>
        <CardContent>
          <Form data={loginForm}>
            <InputField autoFocus name={loginForm.keys.username} fullWidth label='Username'/>
            <Box my={1}>
              <Button variant='contained'
                      color='primary'
                      fullWidth
                      disabled={!loginForm.state.isValid || authenticating}
                      onClick={loginForm.submit}>
                Login
              </Button>
            </Box>
          </Form>
          {authenticating && <LinearProgress/>}
        </CardContent>
      </Card>
    </Layout>
  ))
}
