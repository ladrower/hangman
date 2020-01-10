import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import { Layout } from '@/app/components/Layout/Layout'
import { NavLink } from '@/app/components/NavLink'


export function Welcome() {
  return (
    <Layout title='Welcome'>
      <Card style={{width: '100%', marginTop: 20}}>
        <CardContent>
          <Typography variant='h4' align='center' gutterBottom>
            Welcome to Hangman Game
          </Typography>
          <Typography variant='h6' align='center'>
            Please <NavLink to='/auth'>login</NavLink> to play the game or checkout an <NavLink to='/documentation'>interactive documentation</NavLink>
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  )
}
