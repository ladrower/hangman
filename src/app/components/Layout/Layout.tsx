import {
  Container,
  CssBaseline,
  AppBar,
  Grid,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
  Breadcrumbs
} from '@material-ui/core'
import React, { ReactNode } from 'react'
import { NavLink } from '@/app/components/NavLink'
import { LogoutButton } from '@/app/components/LogoutButton'

type Props = {
  children: ReactNode,
  title: string,
}

export function Layout(props: Props) {
  return (
    <>
      <CssBaseline/>
      <HideOnScroll>
        <AppBar color='default'>
          <Toolbar>
            <Breadcrumbs style={{ flex: 1 }}>
              <NavLink to='/'>
                <Typography variant='h6'>Hangman</Typography>
              </NavLink>
              <Typography variant='h6'>{props.title}</Typography>
            </Breadcrumbs>
            <LogoutButton/>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container maxWidth='sm'>
        <Grid container spacing={3} style={{ paddingTop: 50 }}>
          {props.children}
        </Grid>
      </Container>
    </>
  )
}

function HideOnScroll({children}: {children: ReactNode}) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}
