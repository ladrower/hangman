import React, { useEffect } from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert'
import { Button, Card, CardContent, Fab, Box, Grid, Chip, LinearProgress, Divider, Typography } from '@material-ui/core'
import { Layout } from '@/app/components/Layout/Layout'
import { data as chars } from '@/mock/data/characters.json'
import { observe, useStore } from '@/infrastructure/store'
import { PlayStore } from '@/app/Play/PlayStore'

export function Play() {
  const playStore = useStore(PlayStore)

  useEffect(() => playStore.loadGame(),[])

  return observe(playStore, (
    {
      game,
      charsUsed,
      busy,
      error
    }) => (
    <Layout title='Play'>
      <Box py={3}>
        <Card elevation={3}>
          <CardContent>
            {error && (
              <Box py={2}>
                <Alert severity='error' >{error}</Alert>
              </Box>
            )}
            {game ? (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Chip color={game.attemptsLeft ? 'default' : 'secondary'} label={`Attempts Left: ${game.attemptsLeft}`} />
                </Grid>
                <Grid item xs={6} style={{textAlign: 'right'}}>
                  <Chip color='default' label={`Score: ${game.score}`} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h4' align='center' gutterBottom>
                    {game.puzzle.map(char => char === null ? '_' : char).join(' ')}
                  </Typography>
                  {game.gameOver &&
                    (
                      <Box py={2}>
                        {game.gameOver === 'win' ?
                          <Alert elevation={6} variant='filled' severity='success'>
                            Congratulations! Your score is {game.score}
                          </Alert>
                          :
                          <Alert elevation={6} variant='filled' severity='info'>
                            Sorry, you have lost
                          </Alert>}
                      </Box>
                    )
                  }
                </Grid>
              </Grid>
            ) : (
              <Box py={2}>
                <Skeleton variant='rect' height={80} />
              </Box>
            )}

            <Button
              disabled={busy}
              onClick={() => playStore.loadGame(true)}
              variant={game && game.gameOver ? 'contained' : 'outlined'}
              color='primary'>
              Load new word
            </Button>

            <Box py={1}>
              {busy ? <LinearProgress/> : <Divider style={{marginBottom: 2}} />}
            </Box>

            <Grid container spacing={3}>
              {chars.map(char => (
                <Grid item xs={2} key={char}>
                  <Fab onClick={() => playStore.makeGuess(char)}
                       disabled={busy || charsUsed.has(char) || (!game || !!game.gameOver)}
                       color='primary'
                       key={char}
                  >
                    {char}
                  </Fab>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  ))
}
