import { GameService } from './GameService'
import { GameData } from '@/mock/game/GameServiceInterface'

describe('game API', () => {
  const api = new GameService(localStorage, {
    maxRoundScore: 100,
    maxAttempts: 6,
    words: [{id: 1, word: '3dhubs'}]
  })

  it('registers a user', () => {
    const response = api.checkin('artem')
    expect(response.data.token).toBeDefined()
  })

  it('should create a new game', () => {
    const { data: { token } } = api.checkin('artem')
    const response = api.postGame(token)
    const gameData = response.data as GameData
    expect(gameData.attemptsLeft).toBe(6)
    expect(gameData.gameOver).toBeUndefined()
    expect(gameData.puzzle.filter(Boolean).join('')).toBe('')
  })

  it('should get the last game', () => {
    const { data: { token } } = api.checkin('artem')
    api.postGame(token)
    api.guess('x', token)
    api.guess('h', token)
    api.guess('u', token)
    api.guess('b', token)
    api.guess('s', token)
    const response = api.getGame(token)
    const gameData = response.data as GameData
    expect(gameData.attemptsLeft).toBe(5)
    expect(gameData.gameOver).toBeUndefined()
    expect(gameData.puzzle.filter(Boolean).join('')).toBe('hubs')
  })

  it('should make a correct guess', () => {
    const { data: { token } } = api.checkin('artem')
    api.postGame(token)
    const response = api.guess('3', token)
    const gameData = response.data as GameData
    expect(gameData.attemptsLeft).toBe(6)
    expect(gameData.gameOver).toBeUndefined()
    expect(gameData.puzzle.filter(Boolean).join('')).toBe('3')
  })

  it('should make an incorrect guess', () => {
    const { data: { token } } = api.checkin('artem')
    api.postGame(token)
    const response = api.guess('x', token)
    const gameData = response.data as GameData
    expect(gameData.attemptsLeft).toBe(5)
    expect(gameData.gameOver).toBeUndefined()
    expect(gameData.puzzle.filter(Boolean).join('')).toBe('')
  })

  it('should lose the game after max attempts', () => {
    const { data: { token } } = api.checkin('artem')
    api.postGame(token)
    api.guess('x', token)
    api.guess('x', token)
    api.guess('x', token)
    api.guess('x', token)
    api.guess('x', token)
    const response = api.guess('x', token)
    const gameData = response.data as GameData
    expect(gameData.attemptsLeft).toBe(0)
    expect(gameData.gameOver).toBe('loss')
    expect(gameData.puzzle.filter(Boolean).join('')).toBe('')
  })

  it('should win the game', () => {
    const { data: { token } } = api.checkin('artem')
    api.postGame(token)
    api.guess('3', token)
    api.guess('d', token)
    api.guess('h', token)
    api.guess('u', token)
    api.guess('b', token)
    const response = api.guess('s', token)
    const gameData = response.data as GameData
    expect(gameData.attemptsLeft).toBe(6)
    expect(gameData.gameOver).toBe('win')
    expect(gameData.score).toBe(100)
    expect(gameData.puzzle.filter(Boolean).join('')).toBe('3dhubs')
  })

})
